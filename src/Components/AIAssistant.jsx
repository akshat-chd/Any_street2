import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { getUserProfile } from '../services/firestoreData';
import { askAnyStreetAI } from '../services/ai';
import { loadPetCatalog } from '../utils/pets';
import './AIAssistant.css';

const promptMap = {
  '/': [
    'How can I help a stray animal safely?',
    'What should I do before adopting a pet?',
  ],
  '/adopt': [
    'I live in an apartment and work long hours. Which pets fit me best?',
    'Which adoptable pets seem better for a first-time adopter?',
  ],
  '/resources': [
    'What should I do if I find an injured dog?',
    'How do I prepare before calling a shelter or clinic?',
  ],
  '/sightings': [
    'What details should I include in a sighting report?',
    'How do I approach a nervous stray safely?',
  ],
};

function mapPetForAI(pet) {
  return {
    petKey: pet.petKey,
    name: pet.name,
    animal: pet.animal,
    age: pet.age,
    location: pet.location,
    details: pet.details,
    status: pet.status,
  };
}

export default function AIAssistant() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [petContext, setPetContext] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickPrompts = promptMap[location.pathname] || promptMap['/'];

  useEffect(() => {
    let isMounted = true;

    async function hydrateProfile() {
      if (!currentUser) {
        setProfile({});
        return;
      }

      try {
        const profileData = await getUserProfile(currentUser);

        if (isMounted) {
          setProfile(profileData);
        }
      } catch {
        if (isMounted) {
          setProfile({});
        }
      }
    }

    hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    async function hydratePets() {
      if (location.pathname !== '/adopt') {
        setPetContext([]);
        return;
      }

      try {
        const catalog = await loadPetCatalog();

        if (isMounted) {
          setPetContext(
            catalog.filter((pet) => !pet.isSighting).slice(0, 8).map(mapPetForAI)
          );
        }
      } catch {
        if (isMounted) {
          setPetContext([]);
        }
      }
    }

    hydratePets();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const petLookup = useMemo(() => {
    return new Map(petContext.map((pet) => [pet.petKey, pet]));
  }, [petContext]);

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', text: trimmedMessage }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const reply = await askAnyStreetAI({
        page: location.pathname,
        message: trimmedMessage,
        profile,
        pets: petContext,
        conversation: nextMessages.slice(-6),
      });

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          ...reply,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || 'The AI assistant is unavailable right now.');
    }

    setLoading(false);
  };

  return (
    <div className={`ai-assistant ${isOpen ? 'is-open' : ''}`}>
      {isOpen ? (
        <section className="ai-assistant__panel" aria-label="AnyStreet AI assistant">
          <header className="ai-assistant__header">
            <div>
              <p className="ai-assistant__eyebrow">AI guide</p>
              <h2>AnyStreet Assistant</h2>
            </div>
            <button
              type="button"
              className="ai-assistant__close"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </header>

          <div className="ai-assistant__quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="ai-assistant__chip"
                onClick={() => sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="ai-assistant__messages">
            {messages.length === 0 ? (
              <div className="ai-assistant__empty">
                Ask about adoption fit, stray-reporting steps, or care guidance.
              </div>
            ) : (
              messages.map((message, index) => {
                if (message.role === 'user') {
                  return (
                    <article key={index} className="ai-assistant__message ai-assistant__message--user">
                      <p>{message.text}</p>
                    </article>
                  );
                }

                const recommendedPets = message.recommendedPetKeys
                  ?.map((petKey) => petLookup.get(petKey))
                  .filter(Boolean);

                return (
                  <article key={index} className="ai-assistant__message ai-assistant__message--assistant">
                    <p>{message.answer}</p>
                    {message.nextActions?.length ? (
                      <ul className="ai-assistant__list">
                        {message.nextActions.map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    ) : null}
                    {recommendedPets?.length ? (
                      <div className="ai-assistant__recommendations">
                        {recommendedPets.map((pet) => (
                          <div key={pet.petKey} className="ai-assistant__pet">
                            <strong>{pet.name}</strong>
                            <span>
                              {pet.animal} · {pet.age}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {message.safetyNote ? (
                      <p className="ai-assistant__safety">{message.safetyNote}</p>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>

          {error ? <p className="ai-assistant__error">{error}</p> : null}

          <form
            className="ai-assistant__composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for adoption advice, rescue steps, or local-help guidance..."
              rows="3"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="ai-assistant__toggle"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        Ask AnyStreet AI
      </button>
    </div>
  );
}
