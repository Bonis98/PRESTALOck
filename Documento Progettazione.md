# Team
- **Project Manager**: Bonny
- **Frontend:** Sfriso, Magon
- **Backend:** Bressa, Mora

# Frontend
- **Tecnologie**:
    - NPM con framework Vue.js (Nuxt per gestire Vue?)
    - Bootstrap? O librerie grafiche Vue?

# Backend
- **Tecnologie**:
    - Node.js + NPM
    - OAuth (repo di Mora)
    - SQLite

# Domande
- Come gestire il prestito e restituzione?
- Come rappresentare i dati?
- Aggiungere login tramite Google e Facebook (OAuth)?
- Chi sono gli utenti che utilizzano il servizio (privati e aziende con diversi privilegi)?
- Notifiche per autorizzazione e scadenza del prestito (sempre se bisogna gestire restituzione dei prestiti)?

# Punti principali di sviluppo
- **Priorità 1**:
    - Registrazione/Login (OAuth e anche base con email/psw)
    - Logout
    - Inserimento prodotto che si vuole prestare
    - Pagina con lista di prodotti in prestito
    - Richiesta di prestito
    - Conferma di accettazione prestito
    - Apertura del locker
- **Priorità 2**:
    - Apertura del locker per deposito prodotto
    - Apertura del locker per ritiro prodotto
- **Priorità 3**:
    - Restituzione di oggetto prestato:
        - Apertura del locker per deposito prodotto a fine prestito
        - Apertura del locker per ritiro dell'prodotto a fine prestito
    - Modifica inserzione
- **Priorità 4**:
    - Pre-hash lato frontend delle password
    - Noleggio a pagamento (BONY con la 🏌️)
    - Passaggio a SQL più serio (tipo MySQL/MariaDB)
    - Notifiche push
    - Cambio password/password dimenticata

---
# Flussi principali
- Le comunicazioni avvengono tramite chiamate/risposte HTTP (GET & POST) e i dati vengono passati in oggetti `json`
- Se server va in un errore non recuperabile (es. eccezione), risponde al client con 500 (`Internal Server Error`) 

## Registrazione nuovo utente
| Num | Client                                                                                                                                 | Server                                                                                                                                            | Struttura dati                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Invia dati utenti                                                                                                                      |                                                                                                                                                   | `email`, `password`, `nome`, `cognome`, `datanascita` (`dd-mm-yyyy`), `provincia` (intera), `genere` (`M/F/*`)                                               |
| 2   |                                                                                                                                        | Controlla se esiste già email registrata e se utente > 18 anni. Se tutto ok, risponde con 200 e lista locker provincia utente, altrimenti con 400 | `errortext` (spiega in italiano errore a utente) OPPURE `token` e `listalocker` (array di oggetti json con: `id`, `nome`, `provincia`, `regione`, `address`) |
| 3   | Mostra lista di locker all'utente, invia i locker selezionati dall'utente                                                              |                                                                                                                                                   | `listaLockerSelezionati` (array di id locker)                                                                                                                |
| 4   |                                                                                                                                        | Salva in db i locker selezionati, risponde con 200                                                                                                |                                                                                                                                                              |
| 5   | Se risposta è 400, mostra `errortext`. Altrimenti salva token che poi utilizzerà negli header per autenticarsi e procede alla homepage |                                                                                                                                                   |                                                                                                                                                              |

## Login senza OAuth
| Num | Client                                                                                                         | Server                                                                                                                                                                                                                                                | Struttura dati      |
| --- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1   | Invia email e password                                                                                         |                                                                                                                                                                                                                                                       | `email`, `password` |
| 2   |                                                                                                                | Controlla in db se esiste account con email e password corrispondenti (nel db la password è hashata con salt) Risponde con 200 (credenziali valide) e rispondendo con un token (**DA DEFINIRE FORMATO/UTILIZZO**) oppure 400 (credenziali non valide) | `token`             |
| 3   | Si salva il token nel local storage che poi utilizzerà negli header per autenticarsi nelle successive risposte |                                                                                                                                                                                                                                                       |                     |

## Login con OAuth 
| Num | Client                                                                                                                                                             | Server                                                                                                                                                                                                                                                                                                      | Struttura Dati                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Comunica con autenticatore in base al tasto premuto (Google, Facebook...) fino ad ottenere i token necessari. Invia i token e il nome del servizio usato al server |                                                                                                                                                                                                                                                                                                             | `dati di OAuth`                |
| 2   |                                                                                                                                                                    | Controlla con autenticatore se token è valido. Se è valido, controlla in DB se esiste già mail registrata. Se l'utente esiste già ma non aveva creato account con OAuth vengono uniti i dati. Se non esiste crea account e manda dati utente. Se esiste utente ritorna token (**DA DEFINIRE FORMATO/UTILIZZO**) di utilizzo app | `token` (se esiste già utente), `datiUtente` (se non esisteva utente, oggetto json con: `nome`, `cognome`, `datanascita` (`dd-mm-yyyy`), `genere` (`M/F/*`)) |
| 3   | Se non è presente token rimanda alla pagina di registrazione con dati utente precompilati. Se esiste salva il token nel local storage che poi utilizzerà negli header per autenticarsi nelle successive risposte                                                     |                                                                                                                                                                                                                                                                                                             |                                |


![](https://learn.microsoft.com/en-us/azure/active-directory/develop/media/v2-oauth2-auth-code-flow/convergence-scenarios-native.svg)


## Creazione nuova inserzione
| Num | Client                                                                                                                      | Server                                                                                                                                                               | Struttura dati                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Invia i dati al server                                                                                                      |                                                                                                                                                                      | `titolo`, `descrizione`, `giorniPrestitoMax` (num, rappresenta giorni)           |
| 2   |                                                                                                                             | Salva i dati in db, comunica al client esito (200 se ok, 400 se mancano dati)                                                                                        | `id` (dell'inserzione appena creata)                                             |
| 3   | Notifica utente dell'esito, se ok chiede se caricare foto. Se si, seleziona foto e invia. Se no, mostra la nuova inserzione |                                                                                                                                                                      | `immagine` (**DA DEFINIRE FORMATO**, probabilmente richiesta POST con blob foto) |
| 4   |                                                                                                                             | (Comprime?) e salva foto in cartella apposita (oppure come dato binario direttamente in db), aggiorna inserzione nel db inserendo il nome dell'immagine. Ritorna 200 |                                                                                  |
| 5   | Mostra la nuova inserzione                                                                                                  |                                                                                                                                                                      |                                                                                  |

## Visualizzazione inserzione
- Richiesta: GET con parametri: `id`
- Risposta: `inserzione` (`id`, `titolo`, `descrizione`, `giorniPrestitoMax`, `urlFoto`, `provinciaPropietario`, `lockerProprietario` (array di locker di oggetti json con: `id`, `nome`, `provincia`, `regione`, `address`)

## Visualizzazione elenco inserzioni
- Richiesta: GET con parametri: `id`
- Risposta: `inserzione` (`id`, `titolo`, `descrizione`, `giorniPrestitoMax`, `urlFoto`)

## Prenotazione oggetto
