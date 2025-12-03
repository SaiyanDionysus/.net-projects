using BankApp.API.Data;
using BankApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BankApp.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly ApplicationDbContext _context;

        public AccountService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Account>> GetUserAccountsAsync(int userId)
        {
            return await _context.Accounts
                .Where(a => a.UserId == userId)
                .Include(a => a.Transactions.OrderByDescending(t => t.Date))
                .ToListAsync();
        }

        public async Task<Account> GetAccountByIdAsync(int accountId, int userId)
        {
            return await _context.Accounts
                .Include(a => a.Transactions.OrderByDescending(t => t.Date))
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId);
        }

        public async Task<IEnumerable<Transaction>> GetAccountTransactionsAsync(int accountId, int userId)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId);

            if (account == null)
                return new List<Transaction>();

            return await _context.Transactions
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }
    }
}