import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountsAPI } from '../services/api';
import { LogOut, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Transfer':
      case 'Withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'Deposit':
      case 'Payment':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const mainAccount = accounts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">₿</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">BankApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white mb-8 shadow-2xl card-hover">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg opacity-90 mb-1">Total Balance</h2>
              <p className="text-4xl font-bold mb-2">
                {formatCurrency(mainAccount?.balance || 0)}
              </p>
              <p className="text-sm opacity-80">**** {mainAccount?.accountNumber?.slice(-4) || '0000'}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-center hover:bg-white/30 transition-all transform hover:-translate-y-0.5">
              <ArrowUpRight className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Send</span>
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-center hover:bg-white/30 transition-all transform hover:-translate-y-0.5">
              <ArrowDownLeft className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Request</span>
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-center hover:bg-white/30 transition-all transform hover:-translate-y-0.5">
              <Plus className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Top Up</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
            <div className="text-gray-500 text-sm mb-2">Monthly Income</div>
            <div className="text-2xl font-bold text-gray-900">$4,250</div>
            <div className="text-green-500 text-sm mt-1">+12% from last month</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
            <div className="text-gray-500 text-sm mb-2">Monthly Spending</div>
            <div className="text-2xl font-bold text-gray-900">$2,840</div>
            <div className="text-red-500 text-sm mt-1">-8% from last month</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
            <div className="text-gray-500 text-sm mb-2">Savings Goal</div>
            <div className="text-2xl font-bold text-gray-900">75%</div>
            <div className="text-blue-500 text-sm mt-1">$3,000 of $4,000</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {mainAccount?.transactions?.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-gray-500 text-sm">{transaction.recipient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Accounts */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Accounts</h3>
              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                Manage
              </button>
            </div>
            
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary/30 transition-all card-hover">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                      <p className="text-gray-600 text-sm">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                    <p className="text-gray-600 text-sm">{account.currency}</p>
                  </div>
                </div>
              ))}
              
              <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-500 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add New Account</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;