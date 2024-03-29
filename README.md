# PRESTALOck
![NodeJs 18.12.1](https://img.shields.io/badge/node-18.12.1-green)

Progetto del hackathon 2022 di [Sintra](https://www.sintra.eu).
Una versione live è visualizzabile al sito [http://prestalock.emagon.xyz](http://prestalock.emagon.xyz) (consigliamo di usare Milano come provincia, ci sono già dei prodotti)

# Idea
L'idea del progetto è basata sul concetto di **economia circolare**, ovvero un modello di produzione e consumo che implica: condivisione, prestito, riutilizzo, riparazione, ricondizionamento e riciclo dei materiali e prodotti esistenti il più a lungo possibile.
Per questo motivo nasce *PRESTALOck*, un progetto che attraverso l'utilizzo di smart locker mira ad aiutare utenti che vorrebbero condividere oggetti di uso comune. L'idea è semplice: un utente disposto a prestare un oggetto pubblica sul portale un'inserzione contenete una foto e la descrizione di tale oggetto; un utente che ha necessità di prendere in prestito tale oggetto lo prenota attraverso il portale. I due utenti si scambiano il prodotto depositandolo nello smartlocker accordato.
Gli utenti devono risiedere nella stessa provincia per poter scambiare oggetti.

# Autori:
- [Bonis98](https://github.com/Bonis98) (referente backend e "PM").
- [e-magon](https://github.com/e-magon) (referente frontend).
- [Demiurgo443](https://github.com/Demiurgo443) (backend).
- [Sfriso](https://github.com/sfriso) (frontend).
- [giorgiabressa](https://github.com/giorgiabressa) (progettazione iniziale).

# Come testare il prototipo
- Abbiamo reso disponibile una versione live [qua](http://prestalock.emagon.xyz)
- `cd` nella cartella del backend
- Eseguire `npm install` per installare le dipendenze
- Generare i certificati SSL
  - `cd` in `certificates`
  - Eseguire `openssl req -nodes -new -x509 -keyout server.key -out server.cert`
- Creare file .env (istruzioni in [.env.example](backend/.env.example)) nella cartella del backend.
  - Se non si utilizza OAuth, è possibile non impostare le relative variabili (clientId, ClientSecret e redirectURI)
- Eseguire il server con `npm start`
- **Facoltativo:** popolare il DB con dati demo:
    - Eseguire il server per creare il database sqlite
    - Per ricevere le email di test cambiare gli indirizzi nel file [demoUsers](backend/database/seeders/20221118100203-demoUsers.js):
      - In alternativa usare [mailtrap](https://mailtrap.io) senza cambiare indirizzi (da impostare nel file .env).
    - `cd database/`
    - Eseguire il comando `npx sequelize-cli db:seed:all` per popolarlo.
    - Eseguire il comando `npx sequelize-cli db:seed:undo:all` per rimuovere i dati demo.
- Il server risponde a [localhost](https://localhost/).

# Tecnologie utilizzate
- **Frontend**:
    - NPM con framework Vue.js (Nuxt per gestire Vue).
    - TailwindCSS.

- **Backend**:
    - Node.js + NPM.
    - SQLite + ORM `Sequelize` per base di dati.
    - Libreria Node `Nodemailer` per invio email.
    - Libreria Node `helmet` per incrementare la sicurezza (per es.: aggiungere delle policy CORS).
    - Libreria `googleapis` per oauth2 Google.

# Funzionalità implementate
- Responsiveness per utilizzo da dispositivi mobili.
- Il sistema è una PWA: Progressive Web App, per questo motivo da smartphone è possibile aggiungerla alla schermata home e visualizzarla come un'app installata.
- Registrazione e Login utente:
  - Credenziali classiche.
  - OAuth Google.
  - OAuth Facebook (Accetta solo account developer abilitati, la logica di funzionamento è visibile in [signinFacebook](backend/routes/signinFacebook.js)).
- Logout.
- Notifiche via email.
  - Conferma registrazione utente.
  - Richiesta di prestito.
  - Conferma deposito oggetto nel locker (sia per richiesta, sia per restituzione).
  - Invio codici di sblocco dei locker.
- Inserimento prodotto con relativa foto.
- Modifica di un prodotto.
- Pagina riepilogativa prodotti inseriti e presi in prestito (attivi al momento).
- Pagina riepilogativa prodotti inseriti e presi in prestito (prestiti terminati).
- Area che visualizza informazioni utente.
- Richiesta di prestito.
- Conferma di deposito oggetto nel locker.
- Notifica di avvio procedura restituzione.
- Conferma di deposito oggetto nel locker per restituzione.
- Recupero password dimenticata.
- Modifica dei locker che l'utente intende utilizzare.

# Assunzioni

## Restituzione prodotto
- Si assume che il locker utilizzato per la restituzione del prodotto corrisponda a quello utilizzato per iniziare il prestito.
- Inoltre, il prodotto restituito non torna immediatamente disponibile per un ulteriore prestito, si è deciso di lasciare a discrezione del proprietario la decisione di renderlo di nuovo disponibile (dalla pagina di modifica prodotto).

## Implementazione della prenotazione e rilascio dei locker
- Si assume che il richiedente del prestito ritiri istantaneamente il prodotto nel momento in cui il proprietario lo deposita nel locker.
- In particolare, nell'API `/api/loan/start` chiamata dal proprietario per confermare il deposito di un oggetto viene effettuata anche la chiamata all'API di `release` del locker.
- La decisione è stata presa perché in un contesto reale dovrebbe essere il locker stesso a rilasciare la prenotazione nel momento in cui viene aperto dal richiedente.

## Visualizzazione dei propri prodotti nella pagina principale
- Si assume che nella pagina principale l'utente possa vedere anche i propri prodotti inseriti.
- Tali prodotti non possono essere prenotati dall'utente stesso.
- In un contesto reale non andrebbero mostrati nella pagina principale ma solo in quella del profilo utente.
- La decisione è stata presa per dimostrare il funzionamento dell'app in maniera più intuitiva e permettere di visualizzare i prodotti appena inseriti senza dover utilizzare un altro account.
- Nel codice abbiamo lasciato "commentato" il blocco necessario a implementare questo filtro.

# Sviluppi futuri
Gli autori del prototipo auspicano i seguenti sviluppi futuri:
  - Clustering degli utenti (tramite AI) per mostrare oggetti per i quali l'utente potrebbe essere interessato.
  - Sistema di feedback degli utenti e prestiti (indice di affidabilità di utente nella puntualità di consegna/restituzione e cura dell'oggetto).
  - Pre-hash lato frontend delle password.
  - Possibilità di rendere i prestiti dei noleggi (aggiungendo un compenso in denaro).
  - Passaggio a DBMS più stabile (MySQL/MariaDB).
  - Notifiche push (per utenti mobili).
  - Duplicazione dei dati dell'oggetto nel database al momento della presa in prestito (per mantenere uno storico prestiti immutabile a future modifiche prodotti).
  - Chat tra utenti registrati per richiesta informazioni dettagliate.
