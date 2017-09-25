<h1>BachChain</h1>
<p>BachChain is an ultra-secure music sharing platform that uses smart contracts and the blockchain to ensure that all members of the music production ecosystem are equitably, securely, and instantly compensated every time their music is downloaded.</p>

<p>Music sharing platforms like iTunes and Spotify have been known to take 20-25% of music revenue from artists. BachChain lets artists connect and transact directly with customers utilising the block chain. This removes the need for a distributer and lets record labels and artists keep all of the money they earned themselves.</p>

<h2>Code Architecture</h2>
<img src="https://github.com/stillnotdanny/BachChain/blob/master/IBM%20Hackathon%20-%20Page%201%20(1).png" alt="BachChain Diagram">

<h2>Plans for the Future</h2>
<p>The first priority is improving the applications user interface and reliability. Since this is a minimum viable product, we are missing a lot of the bells and whistles that our full platform would have. Things like a search function, public ledger access, robust payment systems, and an expansion to many types of multimedia will all be included in future versions of BachChain. We want to recreate the music industry by rightfully moving the money from the distributer's hands into those of the artists, producers, and record labels.</p>

<h2>Technology Used</h2>
<p>The key component in BachChain is a combination of IBM Blockchain and Hyperledger which stores all of our smart contracts and payment history. IBM Bluemix lets all of our individual components and applications talk with each other to share data. All data storage is done through IBM Cloudant and IBM Cloud Object Storage. BachChain uses Capital One's Hackathon API, Nessie, to mock banking transactions between users and merchants like artists and record labels. Cloud Foundry, in addition with IBM Bluemix, is used to deploy our application for non-stop use.</p>

<h1>How to Run BachChain on your Local Machine</h1>

In order to run BachChain locally on your computer, you need Node version 6 or above. After you have Node installed, just follow these simple steps:

1. Clone the master branch of the BachChain repository on your Machine
2. Open your terminal and change directories to BachChain
3. Run `npm install` to install the dependancies you need to run the applications
4. Run `npm start` to deploy BachChain locally on your Machine
5. Navigate to `http://localhost:3000/` in your internet browser
6. Begin your BachChain experience!

<p>You can also access this through a deployed instance:
<a href="http://bachchain.mybluemix.net">Bachchain</a>
</p>

