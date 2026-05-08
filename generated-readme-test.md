# ai-twitter-bot

> Repository: https://github.com/ThePhoenix77/ai-twitter-bot

 # ai-twitter-bot

Welcome to the `ai-twitter-bot` repository! This project aims to create an AI-powered Twitter bot that fetches news articles related to specific niches, summarizes them using a pre-trained model, and posts unique tweets containing excerpts or summaries of the articles on Twitter.

## Overview
The `ai-twitter-bot` is built using Python as the primary programming language. It interacts with the Twitter platform through the Twitter API, while utilizing several libraries for various tasks such as fetching news data from APIs, text summarization, and handling environment variables securely. The bot fetches articles based on niche keywords, processes them using an AI model, and posts unique tweets containing excerpts or summaries of the articles.

## Features
- Fetches news articles based on specific niches from a News API
- Utilizes an AI model for summarizing news articles
- Schedules tweets to post these summaries along with original article links
- Stores tweet data for future reference and organization

## Technologies Used
- Python
- requests: For making HTTP requests and fetching news data from the News API
- dotenv: For managing environment variables securely
- Transformers, Torch, Sentencepiece: Part of Hugging Face's Transformers library for natural language processing tasks like summarization (using the BART large CNN model in this case)
- Tweepy and tweety-ns: For interacting with Twitter API endpoints

## Architecture

The project follows a modular design, with distinct functionality encapsulated in separate files and modules that adhere to the Single Responsibility Principle. This makes the code more maintainable, reusable, and easier to test. The sensitive information is securely stored as environment variables using dotenv.

## Installation

To install this project's dependencies, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/ThePhoenix77/ai-twitter-bot.git
   ```

2. Navigate to the cloned repository:
   ```
   cd ai-twitter-bot
   ```

3. Install the required packages using pip:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables by creating a `.env` file and populating it with your Twitter API keys and access tokens as follows:
    ```
    TWITTER_API_KEY=<Your Twitter API Key>
    TWITTER_API_SECRET_KEY=<Your Twitter API Secret Key>
    TWITTER_ACCESS_TOKEN=<Your Twitter Access Token>
    TWITTER_ACCESS_TOKEN_SECRET=<Your Twitter Access Token Secret>
    ```

## Usage

To run the bot, execute the main script:

```
python main.py
```

The bot will fetch news articles, summarize them, filter duplicates, and post selected content on Twitter according to its configured settings in `config.py`.

## Workflow

1. Fetch news articles using the specified API (`fetcher.py`)
2. Summarize articles with machine learning techniques (`summarizer.py`)
3. Score summaries based on niche keywords (`summarizer.py`)
4. Filter duplicate tweets and maintain tweet history (`storage.py`)
5. Schedule and post tweets on Twitter using Tweepy (`tweeter.py`)

## Project Structure

```
ai-twitter-bot/
├── config.py
├── fetcher.py
├── helper.py
├── main.py
├── requirements.txt
├── storage.py
├── summarizer.py
├── test_tweety.py
└── tweeter.py
```

## Conclusion

The `ai-twitter-bot` project showcases how Python and various libraries can be combined to create an engaging Twitter bot that fetches news articles, generates summaries, and posts them on Twitter with machine learning techniques.