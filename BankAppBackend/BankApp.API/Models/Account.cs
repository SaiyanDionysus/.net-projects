using System.Security.Principal;
using System.Transactions;

namespace BankApp.API.Models
{
    public class Account
    {
        public int Id {get; set;}
        public int UserId {get; set;}
        public string AccountNumber {get; set;} = string.Empty;
        public string AccountName {get; set;} = "Main Account";
        public decimal Balance {get; set;} = 1000;
        public string Currency {get; set;} = "USD";
        public AccountType Type {get; set;} = AccountType.Current;
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public virtual User User {get; set;} = null!;
        public virtual ICollection<Transaction> Transactions {get; set;} = new List<Transaction>();
    
    }

    public enum AccountType
    {
        Current,
        Savings,
        Investment
    }
}