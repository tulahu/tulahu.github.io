
# Instagram Follower Fight Statistics Website

This project is a web application that visualizes statistics from Instagram follower "fight" data. Users can search for their Instagram username to find their own stats, filter by date or view all-time results, and see overall rankings and daily summaries based on the uploaded data.


## Project Structure

```
player-stats-site
├── public
│   ├── index.html          # Main HTML document for the website
│   └── data.json           # JSON file containing Instagram fight statistics
├── src
│   ├── App.js              # Main React app file
│   ├── index.js            # React entry point
│   ├── components          # React components (PlayerStats, RankingTable, DailySummary, etc.)
│   └── styles
│       └── main.css        # CSS styles for the application
├── package.json            # Project configuration
└── README.md               # Documentation for the project
```


## Features

- Search for your Instagram username to find your fight stats
- Filter stats by date or view "All Time" results
- Paginated and responsive tables for easy browsing
- View overall player rankings and daily summaries


## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/player-stats-site.git
   ```
2. Navigate to the project directory:
   ```
   cd player-stats-site
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:3000` to view the website.


## Usage

- Enter your Instagram username in the search bar to look up your fight statistics.
- Filter by date or select "All Time" to see your stats for a specific day or overall.
- Browse the rankings and daily summaries to see how you and others performed.


## License

This project is licensed under the MIT License.