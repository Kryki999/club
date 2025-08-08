# Integracja z Strapi

## Struktura komponentów

### Aktualne komponenty (bez Strapi):
- `EventsSection.js` - oryginalna wersja z hardcoded danymi
- `InstagramSection.js` - oryginalna wersja z hardcoded danymi

### Komponenty przygotowane do Strapi:
- `EventsSectionStrapi.js` - wersja z integracją Strapi
- `InstagramSectionStrapi.js` - wersja z integracją Strapi

## Krok 1: Instalacja zależności

```bash
npm install axios
```

## Krok 2: Konfiguracja środowiska

Utwórz plik `.env` w głównym katalogu projektu:

```env
REACT_APP_STRAPI_API_URL=http://localhost:1337/api
```

## Krok 3: Struktura danych w Strapi

### Content Type: Events
- **title** (Text) - Tytuł wydarzenia
- **date** (Date) - Data wydarzenia
- **image** (Media) - Zdjęcie wydarzenia
- **description** (Text, opcjonalne) - Opis wydarzenia
- **ticketUrl** (Text, opcjonalne) - Link do kupna biletu

### Content Type: Instagram Posts
- **image** (Media) - Zdjęcie z Instagrama
- **link** (Text) - Link do posta na Instagramie
- **caption** (Text, opcjonalne) - Podpis do zdjęcia
- **postDate** (Date, opcjonalne) - Data posta

## Krok 4: Przełączenie na komponenty Strapi

### W App.js zmień importy:

```javascript
// Zamiast:
import EventsSection from './components/EventsSection';
import InstagramSection from './components/InstagramSection';

// Użyj:
import EventsSection from './components/EventsSectionStrapi';
import InstagramSection from './components/InstagramSectionStrapi';
```

### Lub zmień nazwy komponentów w renderowaniu:

```javascript
// Zamiast:
<EventsSection />
<InstagramSection />

// Użyj:
<EventsSectionStrapi />
<InstagramSectionStrapi />
```

## Krok 5: Uruchomienie Strapi

1. Uruchom Strapi: `npm run develop` (w katalogu Strapi)
2. Utwórz content types w panelu admin
3. Dodaj przykładowe dane
4. Uruchom React app: `npm start`

## Uwagi

- Upewnij się, że Strapi działa na porcie 1337
- Sprawdź czy API jest publiczne dostępne
- W przypadku problemów z CORS, skonfiguruj odpowiednie ustawienia w Strapi
- Komponenty Strapi mają wbudowane loading i error states
- Fallback do hardcoded danych w przypadku błędu API 