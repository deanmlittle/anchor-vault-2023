import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IDL, Vault } from "../target/types/vault";
import { PublicKey, Commitment, Keypair, SystemProgram } from "@solana/web3.js"
import { BN } from "bn.js";

const confirmTx = async (signature: string) => {
  const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction(
    {
      signature,
      ...latestBlockhash,
    },
    "confirmed"
  )
  return signature
}

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const user = new Keypair();

  const commitment: Commitment = "finalized"; // processed, confirmed, finalized

  const programId = new PublicKey("68h7TjTaRhU5enVLNcZg3KZp76QVQRVhwDZdH6cyTD8q");
  const program = new anchor.Program<Vault>(IDL, programId, anchor.getProvider());

  const state = PublicKey.findProgramAddressSync([Buffer.from("state"), user.publicKey.toBytes()], program.programId)[0];
  const vault = PublicKey.findProgramAddressSync([Buffer.from("vault"), state.toBytes()], program.programId)[0];

  it("Airdrop", async () => {
    await anchor.getProvider().connection.requestAirdrop(user.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL).then(confirmTx);
  });

  it("Initialize", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.initialize()
      .accounts({
        signer: user.publicKey,
        state,
        vault,
        systemProgram: SystemProgram.programId
      })
      .signers([
        user
      ]).rpc().then(confirmTx);
      console.log("Your transaction signature", tx);
    } catch(e) {
      console.error(e);
      throw (e)
    }
  });

  it("Deposit", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.deposit(new BN(10000000))
      .accounts({
        signer: user.publicKey,
        state,
        vault,
        systemProgram: SystemProgram.programId
      })
      .signers([
        user
      ]).rpc().then(confirmTx);
      console.log("Your transaction signature", tx);
    } catch(e) {
      console.error(e);
      throw (e)
    }
  });

  it("Withdraw", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.withdraw(new BN(1000000))
      .accounts({
        signer: user.publicKey,
        state,
        vault,
        systemProgram: SystemProgram.programId
      })
      .signers([
        user
      ]).rpc().then(confirmTx);
      console.log("Your transaction signature", tx);
    } catch(e) {
      console.error(e);
      throw (e)
    }
  });

  it("Close", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.close()
      .accounts({
        signer: user.publicKey,
        state,
        vault,
        systemProgram: SystemProgram.programId
      })
      .signers([
        user
      ]).rpc().then(confirmTx);
      console.log("Your transaction signature", tx);
    } catch(e) {
      console.error(e);
      throw (e)
    }
  });
});
