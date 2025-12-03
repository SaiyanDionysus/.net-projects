using System.Security.Claims;
using BankApp.API.Data;
using BankApp.API.Models;
using BankApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var accounts = await _accountService.GetUserAccountsAsync(userId);
            return Ok(accounts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var account = await _accountService.GetAccountByIdAsync(id, userId);

            if (account == null)
                return NotFound();

            return Ok(account);
        }

        [HttpGet("{id}/transactions")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var transactions = await _accountService.GetAccountTransactionsAsync(id, userId);

            if (transactions == null)
                return NotFound();

            return Ok(transactions);
        }
    }
}