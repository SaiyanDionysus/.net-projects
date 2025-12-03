using BankApp.API.Data;
using BankApp.API.DTOs;
using BankApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace BankApp.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Проверяем, существует ли пользователь
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                    throw new Exception("User with this email already exists");

                // Создаем нового пользователя
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    CreatedAt = DateTime.UtcNow
                };

                // Сохраняем пользователя
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Создаем начальный счет
                var account = new Account
                {
                    UserId = user.Id,
                    AccountNumber = GenerateAccountNumber(),
                    Balance = 1000.00m,
                    Currency = "USD",
                    Type = AccountType.Current,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Accounts.Add(account);
                
                // Создаем демо-транзакции
                var transactions = new List<Transaction>
                {
                    new Transaction
                    {
                        AccountId = account.Id,
                        Type = TransactionType.Deposit,
                        Amount = 1000.00m,
                        Description = "Initial deposit",
                        Recipient = "Bank",
                        Date = DateTime.UtcNow,
                        Status = TransactionStatus.Completed
                    },
                    new Transaction
                    {
                        AccountId = account.Id,
                        Type = TransactionType.Payment,
                        Amount = -50.00m,
                        Description = "Netflix",
                        Recipient = "Netflix Inc.",
                        Date = DateTime.UtcNow.AddDays(-1),
                        Status = TransactionStatus.Completed
                    }
                };

                _context.Transactions.AddRange(transactions);
                await _context.SaveChangesAsync();

                // Генерируем JWT токен
                var token = GenerateJwtToken(user);
                
                return new AuthResponse
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber
                    }
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Registration failed: {ex.Message}");
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Ищем пользователя по email
                var user = await _context.Users
                    .Include(u => u.Accounts)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                // Проверяем существование пользователя и пароль
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                    throw new Exception("Invalid email or password");

                // Генерируем JWT токен
                var token = GenerateJwtToken(user);
                
                return new AuthResponse
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber
                    }
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Login failed: {ex.Message}");
            }
        }

        public string GenerateJwtToken(User user)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-super-secret-key-min-32-characters-long");
                
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim("FirstName", user.FirstName),
                        new Claim("LastName", user.LastName)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key), 
                        SecurityAlgorithms.HmacSha256Signature)
                };
                
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                throw new Exception($"Token generation failed: {ex.Message}");
            }
        }

        private string GenerateAccountNumber()
        {
            var random = new Random();
            return $"LT{random.Next(100000, 999999)}{random.Next(100000, 999999)}";
        }
    }
}