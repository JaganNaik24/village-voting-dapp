// src/components/Voting.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractData from "../contractABI.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed address

const Voting = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [leaderNames, setLeaderNames] = useState([]);
  const [votes, setVotes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractData.abi,
          tempSigner
        );
        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setAccount(await tempSigner.getAddress());

        const leaders = await tempContract.getLeaders();
setLeaderNames(leaders);

const fetchedVotes = await Promise.all(
  leaders.map(async (_, i) => {
    return await tempContract.getVotes(i);
  })
);

        setVotes(fetchedVotes.map(v => v.toString()));
      } else {
        alert("Please install MetaMask");
      }
    };

    init();
  }, []);

  const vote = async (index) => {
    try {
      const tx = await contract.vote(index);
      await tx.wait();
      setMessage("Vote cast successfully!");

      const updatedVotes = await contract.getVotes(index);
      const newVotes = [...votes];
      newVotes[index] = updatedVotes.toString();
      setVotes(newVotes);
    } catch (error) {
      setMessage("Voting failed. Maybe you already voted?");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Village Voting DApp</h1>
      <p><strong>Connected Account:</strong> {account}</p>
      <h2>Leaders:</h2>
      {leaderNames.map((name, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <p>{name} — Votes: {votes[index]}</p>
          <button onClick={() => vote(index)}>Vote</button>
        </div>
      ))}
      <p style={{ color: "green" }}>{message}</p>
    </div>
  );
};

export default Voting;
