# ai-twitter-bot

> Repository: https://github.com/ThePhoenix77/ai-twitter-bot

 # ai-twitter-bot

Welcome to the **ai-twitter-bot** repository! This project aims to create an AI-powered Twitter bot that fetches news articles, summarizes them using machine learning, and tweets out engaging content based on those summaries.

## Overview

The `ai-twitter-bot` is a Python script that leverages several libraries to accomplish its goals. It includes modules for fetching news articles, article summarization, storage of tweet history, and posting tweets on Twitter. The bot is designed to avoid sending duplicate tweets and maintain a record of its previous posts.

## Features

- Fetching news articles using an external API
- Summarizing articles with machine learning techniques (BART large CNN)
- Generating engaging tweets based on summaries
- Scheduling and posting tweets on Twitter
- Storing and loading tweet history for maintaining unique tweets

## Technologies Used

- Python: Primary programming language used for scripting the bot
- requests: HTTP library for making network requests
- dotenv: Library that helps manage environment variables securely
- Transformers (Hugging Face): Pre-trained models for NLP tasks like summarization
- Torch: Machine learning library based on TorchScript and TorchScript JIT compiler
- Sentencepiece: Simple sentence piece BPE tokenizer developed by Hugging Face
- Tweety-ns: Python library for posting tweets on Twitter
- Tweepy: Unofficial Python library for accessing the Twitter API

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

4. Set up environment variables by creating a `.env` file and populating it with your Twitter API keys and access tokens.

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