import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatbotService, type Message, type QuickReply } from '../../services/chatbot';
import './Chatbot.css';

export function Chatbot() {
  const { usuario } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Mensagem inicial de boas-vindas
    const welcomeMessage = chatbotService.getWelcomeMessage(usuario?.nome || 'Visitante');
    setMessages([welcomeMessage]);
  }, [usuario]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Processa resposta do bot
    setTimeout(async () => {
      const botResponse = await chatbotService.processMessage(text, messages);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.text);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      
      // Mensagem do usuário com imagem
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: '📷 Imagem enviada',
        image: imageUrl,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setShowImageUpload(false);
      setIsTyping(true);

      // Análise da imagem pelo bot
      setTimeout(async () => {
        const analysis = await chatbotService.analyzeImage(imageUrl);
        setMessages(prev => [...prev, analysis]);
        setIsTyping(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simula transcrição de áudio
      const transcribedText = "Olá, gostaria de saber mais sobre adoção de cachorros";
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `🎤 "${transcribedText}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(async () => {
        const botResponse = await chatbotService.processMessage(transcribedText, messages);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } else {
      setIsRecording(true);
      // Simula gravação por 3 segundos
      setTimeout(() => {
        if (isRecording) {
          handleVoiceMessage();
        }
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <span>🐕</span>
          </div>
          <div className="chatbot-info">
            <h2>Caramelo IA</h2>
            <span className="status-online">● Online</span>
          </div>
          <div className="chatbot-actions">
            <button className="header-btn" title="Limpar conversa" onClick={() => setMessages([chatbotService.getWelcomeMessage(usuario?.nome || 'Visitante')])}>
              🗑️
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              {message.type === 'bot' && (
                <div className="message-avatar">🐕</div>
              )}
              <div className="message-bubble">
                {message.image && (
                  <img src={message.image} alt="Enviado" className="message-image" />
                )}
                <p>{message.content}</p>
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        className="quick-reply-btn"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply.emoji && <span>{reply.emoji}</span>}
                        {reply.text}
                      </button>
                    ))}
                  </div>
                )}
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">🐕</div>
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="image-upload-modal">
            <div className="modal-content">
              <h3>📷 Enviar Imagem</h3>
              <p>Envie uma foto do animal ou do ambiente para análise</p>
              <div className="upload-options">
                <label className="upload-btn">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    hidden
                  />
                  📁 Escolher Arquivo
                </label>
                <button className="upload-btn camera" onClick={() => fileInputRef.current?.click()}>
                  📸 Tirar Foto
                </button>
              </div>
              <button className="close-modal" onClick={() => setShowImageUpload(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-input-area">
          <button 
            className={`input-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceMessage}
            title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
          >
            {isRecording ? '⏹️' : '🎤'}
          </button>
          
          <button 
            className="input-btn"
            onClick={() => setShowImageUpload(true)}
            title="Enviar imagem"
          >
            📷
          </button>

          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isRecording}
          />

          <button 
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isRecording}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="chatbot-info-panel">
        <h3>🤖 Sobre o Caramelo IA</h3>
        <p>Assistente inteligente para triagem de adoção e suporte.</p>
        
        <div className="features-list">
          <h4>Funcionalidades:</h4>
          <ul>
            <li>🐾 Triagem de adoção automatizada</li>
            <li>📷 Análise de imagens (BCS, ambiente)</li>
            <li>🎤 Transcrição de áudio (Whisper)</li>
            <li>📊 Monitoramento pós-adoção</li>
            <li>🔒 Conformidade com LGPD</li>
          </ul>
        </div>

        <div className="lgpd-notice">
          <h4>🔐 Privacidade</h4>
          <p>Seus dados são protegidos conforme a LGPD. Ao interagir, você concorda com nossa política de privacidade.</p>
        </div>

        <div className="quick-commands">
          <h4>⚡ Comandos Rápidos:</h4>
          <div className="command-tags">
            <span onClick={() => handleSendMessage('Quero adotar')}>Quero adotar</span>
            <span onClick={() => handleSendMessage('Denunciar maus-tratos')}>Denunciar</span>
            <span onClick={() => handleSendMessage('Voluntariado')}>Voluntariado</span>
            <span onClick={() => handleSendMessage('Doar')}>Doar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
