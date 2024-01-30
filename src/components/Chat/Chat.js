// components/Chat.js
"use client"
import { useState } from 'react';
import axios from 'axios';
import styles from './Chat.module.css';
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["latin"] })

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    setIsClicked(true);
    if(inputText != ""){
      
      const openaiApiKey = 'YOUR_OPEN_AI_KEY';
      const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

      // Send the user's message to the OpenAI API
      const response = await axios.post(openaiEndpoint,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: inputText,
          },
        ],
        temperature: 1,
        max_tokens: 50
      },
      {
        headers: {
          Authorization : `Bearer ${openaiApiKey}`,
        },
      });
      console.log(response.data.choices[0].message.content);
      // Update the chat with the user's message and the chatbot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, sender: 'You' },
        { text: response.data.choices[0].message.content, sender: 'bot' },
      ]);


      // Clear the input field
      setInputText('');
    }else{
      setEmpty(true);
    }
  };

  const changeHandler = (e) => {
    setEmpty(false);
    setInputText(e.target.value);
  }

  return (
    <div className={styles.chatContainer}>
      <div>
        <h1 className={styles.title}>Talk to Chatbot <span className={styles.botImageHolder}><img src='icon.png' className={styles.botImage}></img></span></h1>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={sendMessage} className={styles.form}>
          <input
            type='text'
            placeholder='Message to chatbot...'
            value={inputText}
            onChange={changeHandler}
            className={`${styles.inputField} ${cairo.className}`}
          />
          <input
            type='submit'
            value='Send'
            className={`${styles.submitButton} ${cairo.className}`}
          />
        </form>
        {(empty && isClicked) && <p className={styles.error}>The input is empty, Please fill data</p>}
      </div>

      {(messages.length != 0) &&
        (<div className={styles.messageContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[message.sender + 'Message']}`}
            >
              <span className={styles.tag}>{message.sender}: </span>{message.text}
            </div>
          ))}
        </div>)
      }
    </div>
  );
};

export default Chat;
