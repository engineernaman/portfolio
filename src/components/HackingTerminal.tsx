import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Zap } from 'lucide-react';

const HackingTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    'SoumySec Terminal v2.1.0',
    'Type "help" for available commands',
    '$ '
  ]);
  const [isHacking, setIsHacking] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: () => [
      'Available commands:',
      '  help     - Show this help message',
      '  hack     - Initiate penetration test simulation',
      '  scan     - Network vulnerability scan',
      '  exploit  - Run exploit simulation',
      '  clear    - Clear terminal',
      '  matrix   - Enter the matrix',
      '  whoami   - Display user info',
      '  skills   - Show skill levels',
      '  exit     - Close terminal'
    ],
    hack: () => {
      setIsHacking(true);
      setTimeout(() => setIsHacking(false), 5000);
      return [
        'Initiating penetration test...',
        'Scanning target: 192.168.1.0/24',
        'Found 15 active hosts',
        'Checking for vulnerabilities...',
        'CVE-2023-1234 detected on port 443',
        'Attempting exploitation...',
        'Access granted! Root shell obtained.',
        'Penetration test completed successfully.'
      ];
    },
    scan: () => [
      'Nmap scan report for target network',
      'Host is up (0.0012s latency)',
      'PORT     STATE SERVICE',
      '22/tcp   open  ssh',
      '80/tcp   open  http',
      '443/tcp  open  https',
      '3389/tcp open  ms-wbt-server',
      'Scan completed in 2.34 seconds'
    ],
    exploit: () => [
      'Loading Metasploit Framework...',
      'msf6 > use exploit/multi/handler',
      'msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp',
      'msf6 exploit(multi/handler) > set LHOST 10.0.0.1',
      'msf6 exploit(multi/handler) > exploit',
      'Meterpreter session 1 opened',
      'meterpreter > sysinfo',
      'Computer: VICTIM-PC',
      'OS: Windows 10 Build 19041',
      'Architecture: x64',
      'System Language: en_US',
      'Exploit successful!'
    ],
    matrix: () => {
      if ((window as any).triggerMatrix) {
        (window as any).triggerMatrix();
      }
      return [
        'Entering the Matrix...',
        '01001000 01100101 01101100 01101100 01101111',
        '01010111 01101111 01110010 01101100 01100100',
        'Wake up, Neo...',
        'The Matrix has you...',
        'Follow the white rabbit.',
        'Knock, knock, Neo.',
        'Initiating full-screen Matrix mode...'
      ];
    },
    whoami: () => [
      'User: soumy_naman_srivastava',
      'Role: Cybersecurity Lead',
      'Clearance Level: TOP SECRET',
      'Years of Experience: 9+',
      'Specialization: Penetration Testing, DevSecOps',
      'Status: Currently securing the digital world'
    ],
    skills: () => [
      'Skill Assessment Report:',
      '========================',
      'Penetration Testing    ████████████████████ 95%',
      'DevSecOps             ████████████████████ 90%',
      'Security Architecture ████████████████████ 92%',
      'Vulnerability Assessment ███████████████████ 94%',
      'Cloud Security        ████████████████████ 88%',
      'Digital Forensics     ████████████████████ 85%'
    ],
    clear: () => {
      setOutput(['SoumySec Terminal v2.1.0', 'Terminal cleared.', '$ ']);
      return [];
    }
  };

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let response: string[] = [];

    if (command === 'exit') {
      setIsOpen(false);
      return;
    }

    if (commands[command as keyof typeof commands]) {
      response = commands[command as keyof typeof commands]();
    } else if (command === '') {
      response = [];
    } else {
      response = [`Command not found: ${command}`, 'Type "help" for available commands'];
    }

    if (command !== 'clear') {
      setOutput(prev => [...prev.slice(0, -1), `$ ${cmd}`, ...response, '$ ']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
      if ((window as any).playTypingSound) {
        (window as any).playTypingSound();
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Konami code listener
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setIsOpen(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-black/80 border border-green-400 rounded-full text-green-400 hover:bg-green-400/20 transition-all duration-300 z-50 group"
        title="Open Hacking Terminal (or try the Konami code!)"
      >
        <Terminal className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-4 bg-black/95 border border-green-400 rounded-lg z-50 flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-green-400/30 bg-black/50">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono">SoumySec Terminal</span>
          {isHacking && <Zap className="w-4 h-4 text-red-400 animate-pulse" />}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto bg-black/80"
        style={{ fontFamily: 'Courier New, monospace' }}
      >
        {output.map((line, index) => (
          <div key={index} className={`${line.startsWith('$') ? 'text-cyan-400' : 'text-green-400'} ${isHacking && line.includes('exploit') ? 'animate-pulse text-red-400' : ''}`}>
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-cyan-400 mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent outline-none text-green-400 flex-1"
            placeholder="Enter command..."
            autoFocus
          />
          <span className="animate-pulse text-green-400">|</span>
        </div>
      </div>
      
      <div className="p-2 border-t border-green-400/30 bg-black/50 text-xs text-gray-400 font-mono">
        Tip: Try "hack", "matrix", or use ↑↑↓↓←→←→BA for secret access
      </div>
    </div>
  );
};

export default HackingTerminal;