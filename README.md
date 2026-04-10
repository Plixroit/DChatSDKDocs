# ![DChat Logo](Dchat.svg) DChat SDK Documentation

**A self-sovereign, end-to-end encrypted messaging SDK built on Cosmos blockchain**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4.svg)](https://dotnet.microsoft.com/)
[![Cosmos SDK](https://img.shields.io/badge/Cosmos-SDK-2E3256.svg)](https://cosmos.network/)

---

## Overview

DChat SDK is a .NET class library that enables decentralized, end-to-end encrypted messaging in your applications. No phone numbers, no central servers - just cryptographic identities and decentralized delivery.

### Key Features

- **E2EE by Default** - Every message encrypted with recipient's key before leaving device
- **Blockchain Identity** - BIP39/BIP44 key pairs registered on-chain
- **Forward Secrecy** - Automatic chat key rotation for enhanced security
- **Group Messaging** - Symmetric sender keys with automatic distribution
- **WebRTC Calls** - Peer-to-peer voice/video without signaling server
- **gRPC Streaming** - Bidirectional real-time message streaming
- **IPFS Storage** - Decentralized media storage

## Documentation

Live documentation: **[https://plixroit.github.io/DChatSDKDocs/](https://plixroit.github.io/DChatSDKDocs/)**

### Quick Links

| Topic | Description |
|-------|-------------|
| [Getting Started](https://plixroit.github.io/DChatSDKDocs/#/getting-started) | Install, initialize, send first message |
| [Configuration](https://plixroit.github.io/DChatSDKDocs/#/configuration) | Options, nodes, key rotation policies |
| [Identity & Keys](https://plixroit.github.io/DChatSDKDocs/#/identity) | Seed phrases, blockchain registration |
| [Encryption](https://plixroit.github.io/DChatSDKDocs/#/encryption) | E2EE, group keys, forward secrecy |
| [Messaging](https://plixroit.github.io/DChatSDKDocs/#/messaging) | Text, media, files, albums |
| [Groups](https://plixroit.github.io/DChatSDKDocs/#/groups) | Creation, management, sender keys |
| [API Reference](https://plixroit.github.io/DChatSDKDocs/#/api-reference) | Complete interface documentation |

## Architecture

```
+-------------------+
|  Your Application |
|  (MAUI/Blazor/)   |
+--------+----------+
         |
         v
+-------------------+
| DChatSDKClient    |
| + Identity        |
| + Crypto          |
| + Messaging       |
+--------+----------+
         |
         v
+-------------------+     +-------------------+
| GrpcStreaming     |<--->| DChat Node        |
| Service           |     | (Cosmos/CometBFT) |
+-------------------+     +-------------------+
```

## Two-Layer Security

| Layer | Purpose | Key Type | Lifespan |
|-------|---------|----------|----------|
| **Identity Key** | Authentication, DID, signing | Secp256k1 | Permanent |
| **Chat Key** | Message encryption | X25519 | Auto-rotating |

## Quick Start

```csharp
using DChatSDK;

// Create client
var sdk = new DChatSDKClient();

// Configure options
var options = new DChatSdkOptionsBuilder()
    .WithSeedPhrase("your twelve word seed phrase here")
    .WithNodeUrl("https://node.dchat.network")
    .Build();

// Initialize
await sdk.InitializeAsync(options);

// Send a message
await sdk.SendTextMessageAsync(
    recipientDid: "did:dchat:alice",
    message: "Hello from DChat!"
);

// Listen for incoming messages
sdk.OnMessageReceived += (sender, msg) => {
    Console.WriteLine($"Received: {msg.Content}");
};
```

## Installation

```bash
dotnet add package DChatSDK
```

Or via NuGet Package Manager:

```
Install-Package DChatSDK
```

## Requirements

- .NET 8.0 or later
- Platform support: MAUI, Blazor, Console, Xamarin

## License

This SDK is released under the MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

*Built with for decentralized communication*
