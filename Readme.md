# Anchor Vault 2023

A simple Anchor vault that is used to store native SOL tokens.

# Usage

Start up a test validator:

```
solana-test-validator
```

Then run:
```
anchor build
anchor deploy
```

Once deployed, ensure the program is matches in `programs/vault/lib.rs` and `Anchor.toml` and run:

```
anchor test --skip-test-validator
```