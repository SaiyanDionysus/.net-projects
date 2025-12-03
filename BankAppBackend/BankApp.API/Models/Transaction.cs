namespace BankApp.API.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
        public string Recipient { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public TransactionStatus Status { get; set; } = TransactionStatus.Completed;
        
        public virtual Account Account { get; set; } = null!;
    }

    public enum TransactionType
    {
        Transfer,
        Payment,
        Deposit,
        Withdrawal
    }

    public enum TransactionStatus
    {
        Pending,
        Completed,
        Failed,
        Cancelled
    }
}