import { Model } from '../types';

export const MODELS: Model[] = [
  {
    Model: "llama-3.1-sonar-small-128k-online",
    "Parameter Count": "8B",
    "Context Length": 127072,
    "Model Type": "Chat Completion",
    "Tools": "Search"
  },
  {
    Model: "llama-3.1-sonar-large-128k-online",
    "Parameter Count": "70B",
    "Context Length": 127072,
    "Model Type": "Chat Completion",
    "Tools": "Search"
  },
  {
    Model: "llama-3.1-sonar-huge-128k-online",
    "Parameter Count": "405B",
    "Context Length": 127072,
    "Model Type": "Chat Completion",
    "Tools": "Search"
  },
  {
    Model: "llama-3.1-sonar-small-128k-chat",
    "Parameter Count": "8B",
    "Context Length": 127072,
    "Model Type": "Chat Completion",
    "Tools": "Chat"
  },
  {
    Model: "llama-3.1-sonar-large-128k-chat",
    "Parameter Count": "70B",
    "Context Length": 127072,
    "Model Type": "Chat Completion",
    "Tools": "Chat"
  },
  {
    Model: "llama-3.1-8b-instruct",
    "Parameter Count": "8B",
    "Context Length": 131072,
    "Model Type": "Chat Completion",
    "Tools": "Instruct"
  },
  {
    Model: "llama-3.1-70b-instruct",
    "Parameter Count": "70B",
    "Context Length": 131072,
    "Model Type": "Chat Completion",
    "Tools": "Instruct"
  }
];