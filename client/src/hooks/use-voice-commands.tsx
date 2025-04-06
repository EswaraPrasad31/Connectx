import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type VoiceCommandsMap = {
  [command: string]: () => void;
};

type UseVoiceCommandsParams = {
  startListening?: boolean;
};

export function useVoiceCommands(
  commandsMap: VoiceCommandsMap,
  startImmediately = false
) {
  const [isListening, setIsListening] = useState(startImmediately);
  const { toast } = useToast();
  
  // Process the spoken text and execute matching commands
  const processCommand = useCallback((transcript: string) => {
    const lowercaseTranscript = transcript.toLowerCase();
    
    // Log the recognized speech
    console.log('Voice command recognized:', lowercaseTranscript);
    
    // Check for matching commands
    let commandExecuted = false;
    
    Object.keys(commandsMap).forEach(command => {
      if (lowercaseTranscript.includes(command.toLowerCase())) {
        commandsMap[command]();
        commandExecuted = true;
        
        // Show toast notification for the executed command
        toast({
          title: "Voice Command",
          description: `Executing: "${command}"`,
        });
      }
    });
    
    if (!commandExecuted) {
      toast({
        title: "Voice Command",
        description: "Sorry, I didn't recognize that command",
        variant: "destructive",
      });
    }
  }, [commandsMap, toast]);

  // Initialize and handle the Web Speech API
  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      toast({
        title: "Voice Commands Unavailable",
        description: "Your browser doesn't support voice commands.",
        variant: "destructive",
      });
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: event.error === 'no-speech' 
          ? "No speech was detected. Please try again." 
          : `Error: ${event.error}`,
        variant: "destructive",
      });
    };
    
    // Start listening if startImmediately is true
    if (isListening) {
      recognition.start();
    }
    
    // Setup keyboard shortcut (spacebar press)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.ctrlKey && !isListening) {
        e.preventDefault();
        recognition.start();
        toast({
          title: "Voice Commands",
          description: "Listening... Speak a command.",
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      recognition.abort();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening, processCommand, toast]);

  // Allow manual start via the returned function
  return {
    isListening,
    startListening: useCallback(() => {
      if (!isListening) {
        setIsListening(true);
      }
    }, [isListening]),
    stopListening: useCallback(() => {
      if (isListening) {
        setIsListening(false);
      }
    }, [isListening]),
  };
}
