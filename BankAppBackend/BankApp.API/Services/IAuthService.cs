using BankApp.API.DTOs;
using BankApp.API.Models;

namespace BankApp.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        string GenerateJwtToken(User user);
    }
}