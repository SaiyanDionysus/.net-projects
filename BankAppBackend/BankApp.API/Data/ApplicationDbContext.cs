using BankApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApp.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed initial data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "demo@bank.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("demo123"),
                    FirstName = "John",
                    LastName = "Doe",
                    PhoneNumber = "+1234567890",
                    CreatedAt = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<Account>().HasData(
                new Account
                {
                    Id = 1,
                    UserId = 1,
                    AccountNumber = "LT123456789012345678",
                    Balance = 12560.75m,
                    Currency = "USD",
                    Type = AccountType.Current,
                    CreatedAt = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<Transaction>().HasData(
                new Transaction
                {
                    Id = 1,
                    AccountId = 1,
                    Type = TransactionType.Transfer,
                    Amount = -150.00m,
                    Description = "Netflix Subscription",
                    Recipient = "Netflix Inc.",
                    Date = DateTime.UtcNow.AddDays(-1),
                    Status = TransactionStatus.Completed
                },
                new Transaction
                {
                    Id = 2,
                    AccountId = 1,
                    Type = TransactionType.Deposit,
                    Amount = 2500.00m,
                    Description = "Salary",
                    Recipient = "Your Company",
                    Date = DateTime.UtcNow.AddDays(-5),
                    Status = TransactionStatus.Completed
                }
            );
        }
    }
}