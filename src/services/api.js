export async function loginUser(username, password) {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.trim(),
      password: password,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Erro ao realizar login.');
  }

  return json;
}

export async function fetchMarketData() {
  const pairs = 'BTC-BRL,ETH-BRL,SOL-BRL,XRP-BRL,BNB-BRL,LTC-BRL,USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CAD-BRL,AUD-BRL';
  const response = await fetch(`https://economia.awesomeapi.com.br/last/${pairs}`);
  
  if (!response.ok) {
    throw new Error('Falha ao obter cotações da API.');
  }
  
  return await response.json();
}
