import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { posAdocaoService, type Message, type QuickReply, type DocumentoUpload } from '../../services/posAdocao';
import './PosAdocao.css';

export function PosAdocao() {
  const { usuario } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage = posAdocaoService.getWelcomeMessage(usuario?.nome || 'Adotante');
    setMessages([welcomeMessage]);
  }, [usuario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await posAdocaoService.processMessage(inputMessage, messages);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = async (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: reply.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await posAdocaoService.processMessage(reply.text, messages);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleDocumentUpload = async () => {
    if (!documentFile || !documentType) {
      alert('Selecione um arquivo e o tipo de documento');
      return;
    }

    setIsTyping(true);
    const uploadMessage = await posAdocaoService.uploadDocument({
      file: documentFile,
      tipo: documentType,
      adotanteId: usuario?.id || '1',
      animalId: '1' // Simulado
    });

    setMessages(prev => [...prev, uploadMessage]);
    setShowDocumentModal(false);
    setDocumentFile(null);
    setDocumentType('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="pos-adocao-container">
      <div className="pos-adocao-header">
        <div className="header-info">
          <span className="header-icon">🏠</span>
          <div>
            <h2>Acompanhamento Pós-Adoção</h2>
            <p>Suporte contínuo para você e seu pet</p>
          </div>
        </div>
      </div>

      <div className="pos-adocao-main">
        <div className="chat-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  {message.document && (
                    <div className="message-document">
                      📄 {message.document.nome}
                    </div>
                  )}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="quick-replies">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
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
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {message.type === 'user' && (
                  <div className="message-avatar user-avatar">
                    {usuario?.nome?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
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

          <div className="chat-input-container">
            <button 
              className="btn-document"
              onClick={() => setShowDocumentModal(true)}
              title="Upload de documento"
            >
              📎
            </button>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              rows={1}
            />
            <button 
              className="btn-send"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              ➤
            </button>
          </div>
        </div>

        <div className="info-panel">
          <div className="info-section">
            <h3>📋 Checklist Pós-Adoção</h3>
            <ul className="checklist">
              <li>✅ Primeira consulta veterinária</li>
              <li>📋 Documentos da adoção</li>
              <li>📸 Fotos do ambiente</li>
              <li>💉 Cartão de vacinas</li>
              <li>🏠 Visita de acompanhamento</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>📁 Documentos Necessários</h3>
            <ul className="document-types">
              <li>📄 Termo de adoção assinado</li>
              <li>🩺 Atestado veterinário</li>
              <li>📸 Fotos do animal adaptado</li>
              <li>💉 Comprovante de vacinação</li>
              <li>📋 Relatório de visita</li>
            </ul>
          </div>

          <div className="info-section">
            <h3>⏰ Cronograma</h3>
            <div className="timeline">
              <div className="timeline-item">
                <strong>7 dias</strong> - Primeira visita
              </div>
              <div className="timeline-item">
                <strong>30 dias</strong> - Acompanhamento
              </div>
              <div className="timeline-item">
                <strong>90 dias</strong> - Avaliação final
              </div>
            </div>
          </div>

          <div className="info-section lgpd">
            <p>🔒 <strong>Privacidade LGPD</strong></p>
            <p>Seus dados e documentos são protegidos conforme a Lei Geral de Proteção de Dados.</p>
          </div>
        </div>
      </div>

      {showDocumentModal && (
        <div className="modal-overlay" onClick={() => setShowDocumentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📎 Upload de Documento</h3>
              <button onClick={() => setShowDocumentModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tipo de Documento:</label>
                <select 
                  value={documentType} 
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="form-select"
                >
                  <option value="">Selecione...</option>
                  <option value="termo_adocao">Termo de Adoção</option>
                  <option value="atestado_veterinario">Atestado Veterinário</option>
                  <option value="foto_animal">Foto do Animal</option>
                  <option value="comprovante_vacina">Comprovante de Vacinação</option>
                  <option value="relatorio_visita">Relatório de Visita</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Arquivo:</label>
                <input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  accept="image/*,.pdf,.doc,.docx"
                  className="form-input"
                />
                {documentFile && (
                  <p className="file-info">📄 {documentFile.name}</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowDocumentModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-upload"
                onClick={handleDocumentUpload}
                disabled={!documentFile || !documentType}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
