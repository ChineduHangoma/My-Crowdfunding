const web3 = new Web3(window.ethereum);
let accounts;
let contract;

async function connectToMetaMask() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    document.getElementById('account').innerText = accounts[0];
    contract = new web3.eth.Contract(
      [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "minimun",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "approvers",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "manager",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "minimumContribution",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "requests",
          "outputs": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "complete",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "approvalCount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "contribute",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            }
          ],
          "name": "createRequest",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "requestIndex",
              "type": "uint256"
            }
          ],
          "name": "approveRequest",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "internalType": "uint256",
              "name": "requestIndex",
              "type": "uint256"
            }
          ],
          "name": "finalizeRequest",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        }
    ], '0x02C2F2c48CcA0EAE38b8CBe48709D2d905a16b9d'); // Replace 'CONTRACT_ADDRESS' with your actual contract address
    loadCampaigns();
  } catch (error) {
    console.error(error);
  }
}

async function createCampaign() {
  const description = document.getElementById('description').value;
  const goalAmount = web3.utils.toWei(document.getElementById('goalAmount').value, 'ether');

  try {
    await contract.methods.createCampaign(description, goalAmount).send({ from: accounts[0], gas: 3000000 });
    alert('Campaign created successfully!');
    loadCampaigns();
  } catch (error) {
    console.error(error);
    alert('Failed to create campaign: ' + error.message);
  }
}

async function loadCampaigns() {
  const campaignCount = await contract.methods.getCampaignCount().call();
  const campaignsList = document.getElementById('campaigns');

  campaignsList.innerHTML = '';

  for (let i = 0; i < campaignCount; i++) {
    const campaign = await contract.methods.campaigns(i).call();
    const li = document.createElement('li');
    li.textContent = `Description: ${campaign.description}, Goal Amount: ${web3.utils.fromWei(campaign.goalAmount, 'ether')} ETH, Recipient: ${campaign.recipient}, Approval Count: ${campaign.approvalCount}`;
    campaignsList.appendChild(li);
  }
}

window.ethereum.on('accountsChanged', () => {
  window.location.reload();
});

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    await connectToMetaMask();
  } else {
    alert('Please install MetaMask to use this DApp.');
  }
});

// Call createCampaign function
const description = 'Campaign description';
const goalAmount = web3.utils.toWei('1', 'ether'); // 1 ETH in wei
const recipientAddress = 'RECIPIENT_ADDRESS';

contract.methods.createCampaign(description, goalAmount, recipientAddress)
  .send({ from: 'YOUR_SENDER_ADDRESS', gas: 3000000 })
  .on('transactionHash', function (hash) {
    console.log('Transaction hash:', hash);
  })
  .on('receipt', function (receipt) {
    console.log('Transaction receipt:', receipt);
  })
  .on('error', function (error, receipt) {
    console.error('Error:', error);
  });
