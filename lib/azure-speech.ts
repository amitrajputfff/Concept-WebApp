/**
 * Azure Speech Service Utilities
 * Handles Text-to-Speech (TTS) and Speech-to-Text (STT) functionality
 */

import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// Azure Speech Configuration
export interface AzureSpeechConfig {
  subscriptionKey: string;
  region: string;
  language?: string;
  voiceName?: string;
}

// Default configuration - English only
const DEFAULT_LANGUAGE = 'en-US';
const DEFAULT_VOICE = 'en-US-JennyNeural'; // Best quality English voice - professional, natural, clear

/**
 * Initialize Azure Speech Synthesizer for TTS
 */
export function createSpeechSynthesizer(config: AzureSpeechConfig): sdk.SpeechSynthesizer {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.subscriptionKey,
    config.region
  );

  // Set language and voice
  speechConfig.speechSynthesisLanguage = config.language || DEFAULT_LANGUAGE;
  speechConfig.speechSynthesisVoiceName = config.voiceName || DEFAULT_VOICE;

  // Create audio config (use default speaker)
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  // Create synthesizer
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  return synthesizer;
}

/**
 * Speak text using Azure TTS
 */
export async function speakText(
  text: string,
  config: AzureSpeechConfig
): Promise<void> {
  return new Promise((resolve, reject) => {
    const synthesizer = createSpeechSynthesizer(config);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          synthesizer.close();
          resolve();
        } else {
          synthesizer.close();
          reject(new Error(`Speech synthesis failed: ${result.reason}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

/**
 * Initialize Azure Speech Recognizer for STT
 */
export function createSpeechRecognizer(config: AzureSpeechConfig): sdk.SpeechRecognizer {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.subscriptionKey,
    config.region
  );

  // Set language - English (US) only, no other languages
  speechConfig.speechRecognitionLanguage = config.language || DEFAULT_LANGUAGE;

  // Create audio config (use default microphone)
  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

  // Create recognizer
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  return recognizer;
}

/**
 * Recognize speech from microphone using Azure STT
 */
export async function recognizeSpeech(
  config: AzureSpeechConfig,
  onResult?: (text: string) => void,
  onError?: (error: Error) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const recognizer = createSpeechRecognizer(config);

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const text = result.text;
          if (onResult) onResult(text);
          resolve(text);
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          const error = new Error('No speech could be recognized');
          if (onError) onError(error);
          reject(error);
        } else {
          const error = new Error(`Speech recognition failed: ${result.reason}`);
          if (onError) onError(error);
          reject(error);
        }
      },
      (error: any) => {
        recognizer.close();
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) onError(err);
        reject(err);
      }
    );
  });
}

/**
 * Start continuous recognition (for longer conversations)
 */
export function startContinuousRecognition(
  config: AzureSpeechConfig,
  onRecognized: (text: string) => void,
  onError?: (error: Error) => void
): sdk.SpeechRecognizer {
  const recognizer = createSpeechRecognizer(config);

  recognizer.recognizing = (s, e) => {
    // Intermediate results while speaking
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      onRecognized(e.result.text);
    }
  };

  recognizer.canceled = (s, e) => {
    if (onError) {
      onError(new Error(`Recognition canceled: ${e.errorDetails}`));
    }
  };

  recognizer.sessionStopped = (s, e) => {
    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();

  return recognizer;
}

/**
 * Stop continuous recognition
 */
export function stopContinuousRecognition(recognizer: sdk.SpeechRecognizer): void {
  recognizer.stopContinuousRecognitionAsync(() => {
    recognizer.close();
  });
}

