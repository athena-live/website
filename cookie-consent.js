(() => {
  const CONSENT_KEY = 'athena_cookie_consent';
  const CONSENT_TIMESTAMP_KEY = 'athena_cookie_consent_at';
  const STYLE_ID = 'cookie-consent-styles';

  const canUseStorage = () => {
    try {
      const testKey = '__athena_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };

  const storageAvailable = canUseStorage();

  const getConsent = () => {
    if (!storageAvailable) {
      return null;
    }
    return localStorage.getItem(CONSENT_KEY);
  };

  const setConsent = (value) => {
    if (!storageAvailable) {
      return;
    }
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
  };

  const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .cookie-consent {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 24px 16px;
        background: rgba(4, 8, 16, 0.55);
        z-index: 2000;
      }

      .cookie-consent__dialog {
        width: min(820px, 100%);
        background: #0a1324;
        color: #e2e8f0;
        border: 1px solid rgba(84, 111, 152, 0.6);
        border-radius: 18px;
        padding: 24px 28px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
      }

      .cookie-consent__title {
        margin: 0 0 12px;
        font-size: 1.35rem;
        letter-spacing: -0.01em;
      }

      .cookie-consent__body {
        margin: 0 0 18px;
        font-size: 0.97rem;
        line-height: 1.6;
        color: #cbd5f5;
      }

      .cookie-consent__body a {
        color: #7bb0ff;
        text-decoration: underline;
      }

      .cookie-consent__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      .cookie-consent__button {
        border-radius: 999px;
        padding: 10px 18px;
        font-size: 0.95rem;
        font-weight: 600;
        border: 1px solid transparent;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .cookie-consent__button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(123, 176, 255, 0.35);
      }

      .cookie-consent__button--decline {
        background: transparent;
        color: #cbd5f5;
        border-color: rgba(124, 153, 199, 0.8);
      }

      .cookie-consent__button--accept {
        background: #7bb0ff;
        color: #0a1324;
        border-color: transparent;
      }

      .cookie-consent__button:hover {
        transform: translateY(-1px);
      }

      .cookie-consent-open {
        overflow: hidden;
      }

      @media (max-width: 640px) {
        .cookie-consent__dialog {
          padding: 20px;
        }

        .cookie-consent__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .cookie-consent__button {
          width: 100%;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(style);
  };

  const hideBanner = () => {
    const banner = document.querySelector('.cookie-consent');
    if (!banner) {
      return;
    }
    banner.remove();
    document.body.classList.remove('cookie-consent-open');
  };

  const buildBanner = () => {
    if (document.querySelector('.cookie-consent')) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'cookie-consent';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-labelledby', 'cookie-consent-title');

    wrapper.innerHTML = `
      <div class="cookie-consent__dialog" role="document">
        <h2 class="cookie-consent__title" id="cookie-consent-title">Welcome to Athena.live</h2>
        <p class="cookie-consent__body">
          In addition to cookies that are strictly necessary to operate this website, we use the following types of
          cookies to improve your experience and our services: Functional cookies to enhance your experience (for example
          remembering settings), Performance cookies to measure the website's performance, and Marketing/Targeting
          cookies, which are set by third parties to support campaigns, manage our relationship with you, build a profile
          of your interests, and provide content or service offerings in accordance with your preferences.
        </p>
        <p class="cookie-consent__body">
          You may withdraw your consent to cookies at any time once you have entered the website through a link in the
          cookie policy, which you can find at the bottom of each page in the Legal and Privacy section.
          <a href="cookie-policy.html">Review our cookie policy</a> for more information.
        </p>
        <div class="cookie-consent__actions">
          <button class="cookie-consent__button cookie-consent__button--decline" type="button" data-cookie-action="decline">
            I decline optional cookies
          </button>
          <button class="cookie-consent__button cookie-consent__button--accept" type="button" data-cookie-action="accept">
            I accept all cookies
          </button>
        </div>
      </div>
    `;

    const declineButton = wrapper.querySelector('[data-cookie-action="decline"]');
    const acceptButton = wrapper.querySelector('[data-cookie-action="accept"]');

    if (declineButton) {
      declineButton.addEventListener('click', () => {
        setConsent('essential');
        hideBanner();
      });
    }

    if (acceptButton) {
      acceptButton.addEventListener('click', () => {
        setConsent('all');
        hideBanner();
      });
    }

    document.body.appendChild(wrapper);
    document.body.classList.add('cookie-consent-open');

    if (declineButton) {
      declineButton.focus();
    }
  };

  const showBanner = ({ force = false } = {}) => {
    if (!force && getConsent()) {
      return;
    }
    injectStyles();
    buildBanner();
  };

  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    if (window.location.hash === '#cookie-settings') {
      showBanner({ force: true });
    } else {
      showBanner();
    }
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) {
      return;
    }
    event.preventDefault();
    showBanner({ force: true });
  });

  window.AthenaCookieConsent = {
    open: () => showBanner({ force: true })
  };
})();
