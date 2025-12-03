using BankApp.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankApp.API.Services
{
    public interface IAccountService
    {
        Task<IEnumerable<Account>> GetUserAccountsAsync(int userId);
        Task<Account> GetAccountByIdAsync(int accountId, int userId);
        Task<IEnumerable<Transaction>> GetAccountTransactionsAsync(int accountId, int userId);
    }
}