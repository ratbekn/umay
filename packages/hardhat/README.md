Ок, вот короткий README по делу:

---

````markdown
# HMPToken Deployment

## Установка
```bash
mkdir hmp && cd hmp
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
npx hardhat
````

## Компиляция

```bash
npx hardhat compile
```

## Деплой в Polygon

`scripts/deploy.js`:

```js
const { ethers } = require("hardhat");

async function main() {
    const USDT = process.env.USDT_ADDRESS || "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDT
    const COMPANY = process.env.COMPANY_WALLET; // кошелёк компании (куда пойдут USDT с покупок)

    if (!COMPANY) throw new Error("COMPANY_WALLET is required");

    const HMP = await ethers.getContractFactory("HMPToken");
    const hmp = await HMP.deploy(USDT, COMPANY);
    await hmp.waitForDeployment();

    console.log("HMP deployed at:", await hmp.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

Запуск:

```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Передача владения на Safe

`scripts/transferOwnership.js`:

```js
async function main() {
  const hmp = await ethers.getContractAt("HMPToken", process.env.HMP_ADDRESS);
  await hmp.transferOwnership("0xВАШ_SAFE");
  console.log("Ownership transferred");
}
main().catch(console.error);
```

Запуск:

```bash
npx hardhat run scripts/transferOwnership.js --network polygon
```

## Верификация в Polygonscan

```bash
npx hardhat verify --network polygon 0xEc8d2a4c9155BfdB9395E010f31712db3A9C0d0B 0xc2132D05D31c914a87C6611C10748AEb04B58e8F 0x9D89fe49E3bF8D0F3965fa6D37Aa1e598609729A
```