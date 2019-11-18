/*

  how i would do this without escrow contracts:
  i would have a node app on a centralized server
  that would check answers

  there would be an escrow addr for each competition

  then when someone gets it right, it pays them out
  the balance of the contract

*/

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const fetch = require('node-fetch')
const bigInt = require("big-integer")

require('dotenv').config()

const ongoingCompetitions = [ 6, 114, 165, 390, 579, 627, 633, 732, 906, 921, 975 ]

const algosdk = require('algosdk')

const algorandToken = { 'X-API-Key': process.env.PURESTAKE_API_KEY }
const algorandNode = "https://betanet-algorand.api.purestake.io/ps1"
const algorandNodePort = ""

const algodclient = new algosdk.Algod(algorandToken, algorandNode, algorandNodePort)

const algorandEscrowAccounts = [
  {
    competition: ongoingCompetitions[0],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_0),
    solved: false
  },
  {
    competition: ongoingCompetitions[1],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_1),
    solved: false
  },
  {
    competition: ongoingCompetitions[2],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_2),
    solved: false
  },
  {
    competition: ongoingCompetitions[3],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_3),
    solved: false
  },
  {
    competition: ongoingCompetitions[4],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_4),
    solved: false
  },
  {
    competition: ongoingCompetitions[5],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_5),
    solved: false
  },
  {
    competition: ongoingCompetitions[6],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_6),
    solved: false
  },
  {
    competition: ongoingCompetitions[7],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_7),
    solved: false
  },
  {
    competition: ongoingCompetitions[8],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_8),
    solved: false
  },
  {
    competition: ongoingCompetitions[9],
    recovered_account: algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC_9),
    solved: false
  }
]

app.use(express.json())

app.get('/', (req, res) => res.send('hello algo world'))

app.post('/competition/:number', async (req, res) => {
  let competitionIndex = ongoingCompetitions.indexOf(parseInt(req.params.number))
  // check that req.params.number is a valid ongoing competition
  if (competitionIndex == -1) {
    res.send({ errorMessage: 'very nice try' })
  } else {
    // check that the competition is still unsolved
    if (ongoingCompetitions[competitionIndex].solved == true) {
      res.send({ errorMessage: 'very nice try this has already been solved' })
    }
    // check that the submission works
    let a = req.body.a
    let b = req.body.b
    let c = req.body.c

    let aCubed = bigInt(a).pow(3)
    let bCubed = bigInt(b).pow(3)
    let cCubed = bigInt(c).pow(3)

    if (aCubed.plus(bCubed).plus(cCubed) != req.params.number) {
      res.send({ errorMessage: 'sorry that is not a solution' })
    } else {
      // get balance of escrow account
      let response = await fetch(`${algorandNode}/v1/account/${algorandEscrowAccounts[competitionIndex].recovered_account.addr}`, {
        method: 'GET',
        headers: {
          "accept": "application/json",
          "X-API-Key": process.env.PURESTAKE_API_KEY
        }
      })
      let json = await response.json()
      let balance = json.amount

      res.send({ balance })

      // send submitter the algos in the escrow account

    }
  }
})

app.listen(port, () => console.log(`listening on port ${port}!`))
