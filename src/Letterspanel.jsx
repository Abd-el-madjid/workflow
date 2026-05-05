import React, { useState, useEffect } from 'react';
import { supabaseClient } from './supabaseClient';
import { LETTERS } from './Letters';

const printLetter = (letter) => {
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${letter.title}</title>
<style>
  @page { margin: 2cm 2.5cm; }
  body { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; line-height: 1.7; color: #1a1a1a; }
  h1 { font-size: 14pt; border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 6px; }
  h2 { font-size: 11pt; color: #555; font-style: italic; margin-bottom: 24px; font-weight: normal; }
  pre { font-family: 'Times New Roman', Georgia, serif; font-size: 12pt; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>
<h1>${letter.title}</h1>
<h2>${letter.subtitle}</h2>
<pre>${letter.content}</pre>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>`);
  win.document.close();
};

const LettersPanel = ({ user }) => {
  const [activeLetter, setActiveLetter] = useState(LETTERS[0].id);
  const [userLetters, setUserLetters] = useState({});
  const [editedLetters, setEditedLetters] = useState({}); // Track unsaved changes
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' }); // success, error, info
  const [uploadedFileName, setUploadedFileName] = useState({}); // Track uploaded file names
  const [signedUrls, setSignedUrls] = useState({}); // Private preview URLs for private storage files
  const [letterHistory, setLetterHistory] = useState({}); // Track letter history
  const [showHistory, setShowHistory] = useState(false); // Toggle history view

  // Load user letters on mount and when user changes
  useEffect(() => {
    if (user) {
      loadUserLetters();
    }
  }, [user]);

  const showModal = (title, message, type = 'info') => {
    setModal({ show: true, title, message, type });
    const modalTimeout = parseInt(import.meta.env.VITE_MODAL_TIMEOUT_MS) || 3000;
    setTimeout(() => setModal({ show: false, title: '', message: '', type: 'info' }), modalTimeout);
  };

  const loadUserLetters = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabaseClient
        .from('user_letters')
        .select('letter_id, title, content, file_path, file_name')
        .eq('user_id', user.id);

      if (error) throw error;

      const lettersMap = {};
      const fileNamesMap = {};
      data.forEach(letter => {
        lettersMap[letter.letter_id] = letter;
        if (letter.file_name) {
          fileNamesMap[letter.letter_id] = letter.file_name;
        }
      });
      setUserLetters(lettersMap);
      setUploadedFileName(fileNamesMap);
      setEditedLetters({}); // Clear any unsaved changes
      setSignedUrls({});

      // Load letter history
      await loadLetterHistory();
    } catch (error) {
      console.error('Error loading letters:', error);
    }
  };

  const loadLetterHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabaseClient
        .from('letter_history')
        .select('letter_id, title, content, file_path, file_name, version_number, created_at')
        .eq('user_id', user.id)
        .order('letter_id', { ascending: true })
        .order('version_number', { ascending: false });

      if (error) throw error;

      const historyMap = {};
      data.forEach(item => {
        if (!historyMap[item.letter_id]) {
          historyMap[item.letter_id] = [];
        }
        historyMap[item.letter_id].push(item);
      });
      setLetterHistory(historyMap);
    } catch (error) {
      console.error('Error loading letter history:', error);
    }
  };

  const loadSignedUrlForLetter = async (letterId, filePath) => {
    if (!letterId || !filePath) return;
    try {
      const expirySeconds = parseInt(import.meta.env.VITE_SIGNED_URL_EXPIRY) || 3600;
      const { data, error } = await supabaseClient.storage
        .from('letters')
        .createSignedUrl(filePath, expirySeconds);

      if (error) {
        console.error('Signed URL error:', error);
        return;
      }

      setSignedUrls(prev => ({
        ...prev,
        [letterId]: data.signedUrl
      }));
    } catch (error) {
      console.error('Signed URL exception:', error);
    }
  };

  useEffect(() => {
    const filePath = editedLetters[activeLetter]?.file_path || userLetters[activeLetter]?.file_path;
    if (filePath) {
      loadSignedUrlForLetter(activeLetter, filePath);
    }
  }, [activeLetter, userLetters, editedLetters]);

  const saveLetter = async (letterId) => {
    if (!user) {
      showModal('Erreur', 'Utilisateur non connecté', 'error');
      return;
    }

    const startTime = Date.now();
    setSaving(true);
    setSaveStatus('Sauvegarde...');

    try {
      const edited = editedLetters[letterId];
      if (!edited) {
        setSaveStatus('Aucune modification');
        showModal('Info', 'Aucune modification à sauvegarder', 'info');
        setTimeout(() => setSaveStatus(''), 2000);
        return;
      }

      // First, save current version to history
      const currentLetter = userLetters[letterId];
      if (currentLetter) {
        const currentHistory = letterHistory[letterId] || [];
        const nextVersion = currentHistory.length > 0 ? Math.max(...currentHistory.map(h => h.version_number)) + 1 : 1;

        const { error: historyError } = await supabaseClient
          .from('letter_history')
          .insert({
            user_id: user.id,
            letter_id: letterId,
            title: currentLetter.title,
            content: currentLetter.content,
            file_path: currentLetter.file_path,
            file_name: currentLetter.file_name,
            version_number: nextVersion
          });

        if (historyError) {
          console.error('History save error:', historyError);
          // Continue with main save even if history fails
        }
      }

      const { error } = await supabaseClient
        .from('user_letters')
        .upsert({
          user_id: user.id,
          letter_id: letterId,
          title: edited.title,
          content: edited.content,
          file_path: edited.file_path || userLetters[letterId]?.file_path,
          file_name: edited.file_name || userLetters[letterId]?.file_name,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,letter_id' });

      const duration = Date.now() - startTime;

      if (error) {
        console.error('❌ Database save error:', error);
        setSaveStatus('Erreur ⚠');
        showModal('Erreur de sauvegarde', `Échec après ${duration}ms: ${error.message}`, 'error');
      } else {
        console.log(`✅ Save successful in ${duration}ms`);
        setSaveStatus('✓ Sauvegardé');
        showModal('Succès', `Sauvegardé en ${duration}ms`, 'success');

        // Update saved letters and clear edited state
        setUserLetters(prev => ({
          ...prev,
          [letterId]: {
            title: edited.title,
            content: edited.content,
            file_path: edited.file_path || prev[letterId]?.file_path,
            file_name: edited.file_name || prev[letterId]?.file_name
          }
        }));
        setEditedLetters(prev => {
          const newEdited = { ...prev };
          delete newEdited[letterId];
          return newEdited;
        });

        // Reload history to include the new version
        await loadLetterHistory();
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Exception during save (${duration}ms):`, error);
      setSaveStatus('Erreur ⚠');
      showModal('Erreur', `Exception après ${duration}ms: ${error.message}`, 'error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(''), 2500);
    }
  };

  const handleContentChange = (letterId, newContent) => {
    setEditedLetters(prev => ({
      ...prev,
      [letterId]: {
        ...prev[letterId],
        content: newContent,
        title: prev[letterId]?.title || userLetters[letterId]?.title || LETTERS.find(l => l.id === letterId).title
      }
    }));
  };

  const handleTitleChange = (letterId, newTitle) => {
    setEditedLetters(prev => ({
      ...prev,
      [letterId]: {
        ...prev[letterId],
        title: newTitle,
        content: prev[letterId]?.content || userLetters[letterId]?.content || LETTERS.find(l => l.id === letterId).content
      }
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) {
      console.log('❌ Upload failed: No file selected or no user');
      showModal('Erreur', 'Aucun fichier sélectionné ou utilisateur non connecté', 'error');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      setSaveStatus('Type de fichier non supporté');
      showModal('Type non supporté', 'Formats acceptés: PDF, DOC, DOCX, TXT', 'error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    // Validate file size (max configurable MB)
    const maxFileSizeMB = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 10;
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      console.log('❌ File too large:', file.size, 'bytes');
      setSaveStatus(`Fichier trop volumineux (max ${maxFileSizeMB}MB)`);
      showModal('Fichier trop volumineux', `Taille maximum: ${maxFileSizeMB}MB`, 'error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    const startTime = Date.now();
    setSaveStatus('Upload en cours...');

    console.log(`🔄 Starting file upload: ${file.name} (${file.size} bytes) at ${new Date().toISOString()}`);

    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const filePath = `${user.id}/${activeLetter}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('letters')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signedData, error: signedUrlError } = await supabaseClient.storage
        .from('letters')
        .createSignedUrl(filePath, parseInt(import.meta.env.VITE_SIGNED_URL_EXPIRY) || 3600);

      if (signedUrlError) {
        throw signedUrlError;
      }

      const signedUrl = signedData?.signedUrl;
      const uploadDuration = Date.now() - startTime;

      setEditedLetters(prev => ({
        ...prev,
        [activeLetter]: {
          ...prev[activeLetter],
          file_path: filePath,
          file_name: file.name,
          title: prev[activeLetter]?.title || userLetters[activeLetter]?.title || LETTERS.find(l => l.id === activeLetter).title,
          content: prev[activeLetter]?.content || userLetters[activeLetter]?.content || LETTERS.find(l => l.id === activeLetter).content
        }
      }));

      setSignedUrls(prev => ({
        ...prev,
        [activeLetter]: signedUrl
      }));

      setUploadedFileName(prev => ({
        ...prev,
        [activeLetter]: file.name
      }));

      setSaveStatus('Fichier uploadé ✓');
      showModal('Upload réussi', `Fichier uploadé en ${uploadDuration}ms`, 'success');
      setTimeout(() => setSaveStatus(''), 2500);

      event.target.value = '';

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ File upload failed after ${duration}ms:`, error);
      setSaveStatus('Erreur upload ⚠');
      showModal('Erreur upload', `Échec après ${duration}ms: ${error.message}`, 'error');
      setTimeout(() => setSaveStatus(''), 2500);
    }
  };

  const restoreLetterVersion = async (letterId, historyItem) => {
    if (!user) {
      showModal('Erreur', 'Utilisateur non connecté', 'error');
      return;
    }

    const confirmRestore = window.confirm(`Êtes-vous sûr de vouloir restaurer la version ${historyItem.version_number} (${new Date(historyItem.created_at).toLocaleString('fr-FR')}) ? Cette action sauvegardera d'abord la version actuelle dans l'historique.`);

    if (!confirmRestore) return;

    setSaving(true);
    setSaveStatus('Restauration...');

    try {
      // First, save current version to history
      const currentLetter = userLetters[letterId];
      if (currentLetter) {
        const currentHistory = letterHistory[letterId] || [];
        const nextVersion = currentHistory.length > 0 ? Math.max(...currentHistory.map(h => h.version_number)) + 1 : 1;

        await supabaseClient
          .from('letter_history')
          .insert({
            user_id: user.id,
            letter_id: letterId,
            title: currentLetter.title,
            content: currentLetter.content,
            file_path: currentLetter.file_path,
            file_name: currentLetter.file_name,
            version_number: nextVersion
          });
      }

      // Restore the selected version
      const { error } = await supabaseClient
        .from('user_letters')
        .upsert({
          user_id: user.id,
          letter_id: letterId,
          title: historyItem.title,
          content: historyItem.content,
          file_path: historyItem.file_path,
          file_name: historyItem.file_name,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,letter_id' });

      if (error) throw error;

      // Update local state
      setUserLetters(prev => ({
        ...prev,
        [letterId]: {
          title: historyItem.title,
          content: historyItem.content,
          file_path: historyItem.file_path,
          file_name: historyItem.file_name
        }
      }));

      setEditedLetters(prev => {
        const newEdited = { ...prev };
        delete newEdited[letterId];
        return newEdited;
      });

      // Reload history
      await loadLetterHistory();

      setSaveStatus('✓ Restauré');
      showModal('Succès', `Version ${historyItem.version_number} restaurée`, 'success');
      setTimeout(() => setSaveStatus(''), 2500);

    } catch (error) {
      console.error('Error restoring version:', error);
      setSaveStatus('Erreur ⚠');
      showModal('Erreur', `Échec de la restauration: ${error.message}`, 'error');
      setTimeout(() => setSaveStatus(''), 2500);
    } finally {
      setSaving(false);
    }
  };

  const letter = LETTERS.find(l => l.id === activeLetter);
  const userLetter = userLetters[activeLetter];
  const editedLetter = editedLetters[activeLetter];
  const currentContent = editedLetter?.content || userLetter?.content || letter.content;
  const currentTitle = editedLetter?.title || userLetter?.title || letter.title;
  const currentFilePath = editedLetter?.file_path || userLetter?.file_path;
  const currentFileUrl = signedUrls[activeLetter];
  const currentFileName = uploadedFileName[activeLetter] || editedLetter?.file_name || userLetter?.file_name || 'Fichier';
  const hasUnsavedChanges = !!editedLetter;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="letters-wrap">
      <div className="letters-tabs">
        {LETTERS.map(l => (
          <button
            key={l.id}
            className={`letter-tab${activeLetter === l.id ? ' active' : ''}`}
            onClick={() => { setActiveLetter(l.id); setCopied(false); }}
          >
            {l.id === 'l1' && '✍️ Lettre principale'}
            {l.id === 'l2' && '🗼 PEC Belle-sœur'}
            {l.id === 'l3' && '🌙 PEC Parent DZ'}
            {l.id === 'l4' && '🏠 Guide DSE'}
          </button>
        ))}
      </div>

      {letter && (
        <div className="letter-content-area">
          <div className="letter-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  className="letter-title-input"
                  value={currentTitle}
                  onChange={(e) => handleTitleChange(activeLetter, e.target.value)}
                  placeholder="Titre de la lettre"
                />
                {hasUnsavedChanges && <span style={{ color: '#f59e0b', fontSize: '12px' }}>●</span>}
              </div>
              <p className="letter-subtitle">{letter.subtitle}</p>
            </div>
            <div className="letter-actions">
              <button className="letter-btn template-btn" onClick={() => loadTemplate(activeLetter)}>
                📋 Charger modèle
              </button>
              {hasUnsavedChanges && (
                <button 
                  className="letter-btn save-btn" 
                  onClick={() => saveLetter(activeLetter)}
                  disabled={saving}
                >
                  💾 Sauvegarder
                </button>
              )}
              <button className="letter-btn copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copié !' : '📋 Copier'}
              </button>
              <button className="letter-btn pdf-btn" onClick={() => printLetter({ title: currentTitle, subtitle: letter.subtitle, content: currentContent })}>
                🖨 Imprimer / PDF
              </button>
              <label className="letter-btn upload-btn">
                📎 Upload
                <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {saveStatus && (
            <div className={`save-status${saving ? ' loading' : ''}`}>{saveStatus}</div>
          )}

          <div className="letter-instructions">
            <span>📌</span>
            <span>Remplacez tous les <strong>[crochets]</strong> par vos vraies informations. Modifiez le contenu selon vos besoins.</span>
          </div>

          <textarea
            className="letter-editor"
            value={currentContent}
            onChange={(e) => handleContentChange(activeLetter, e.target.value)}
            spellCheck="false"
            placeholder="Contenu de la lettre..."
          />

          {/* PDF Section */}
          {currentFilePath && (
            <div className="letter-section">
              <div className="section-header">
                <h3>📎 Document Attaché</h3>
              </div>
              <div className="section-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <strong>{currentFileName}</strong>
                  {currentFileUrl ? (
                    <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                      🔗 Ouvrir le fichier
                    </a>
                  ) : (
                    <span style={{ color: '#6b7280' }}>Chargement du lien...</span>
                  )}
                </div>
                {currentFileUrl && currentFileName.toLowerCase().endsWith('.pdf') && (
                  <div className="pdf-preview">
                    <iframe
                      src={currentFileUrl}
                      width="100%"
                      height="400px"
                      style={{ border: '1px solid #e5e7eb', borderRadius: '4px' }}
                      title="PDF Preview"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Section */}
          <div className="letter-section">
            <div className="section-header">
              <h3>📚 Historique des Modifications</h3>
              <button 
                className="toggle-history-btn"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? '🔽 Masquer' : '🔼 Afficher'} ({letterHistory[activeLetter]?.length || 0} versions)
              </button>
            </div>
            {showHistory && (
              <div className="section-content">
                {letterHistory[activeLetter]?.length > 0 ? (
                  <div className="history-list">
                    {letterHistory[activeLetter].map((historyItem, index) => (
                      <div key={historyItem.id} className="history-item">
                        <div className="history-info">
                          <span className="history-version">Version {historyItem.version_number}</span>
                          <span className="history-date">
                            {new Date(historyItem.created_at).toLocaleString('fr-FR')}
                          </span>
                          {historyItem.file_name && (
                            <span className="history-file">📎 {historyItem.file_name}</span>
                          )}
                        </div>
                        <div className="history-actions">
                          <button 
                            className="history-restore-btn"
                            onClick={() => restoreLetterVersion(activeLetter, historyItem)}
                            disabled={saving}
                          >
                            🔄 Restaurer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-history">Aucune version sauvegardée pour cette lettre.</p>
                )}
              </div>
            )}
          </div>

          <div className="letter-footer-note">
            <strong>Après impression :</strong> signer à la main avec un stylo noir, dater manuellement.
            {letter.id === 'l2' && ' La belle-sœur doit faire légaliser sa signature à la mairie de son arrondissement parisien.'}
            {letter.id === 'l3' && ' Le parent doit faire légaliser sa signature à l\'APC de sa commune.'}
          </div>
        </div>
      )}

      {/* Modal for feedback */}
      {modal.show && (
        <div className="modal-overlay" onClick={() => setModal({ show: false, title: '', message: '', type: 'info' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-header modal-${modal.type}`}>
              <h3>{modal.title}</h3>
              <button className="modal-close" onClick={() => setModal({ show: false, title: '', message: '', type: 'info' })}>×</button>
            </div>
            <div className="modal-body">
              <p>{modal.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LettersPanel;