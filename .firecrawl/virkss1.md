## 25%

FAIL Keep practicing!
[Image: X4]

0/0
[Image: X4]

0%

60% pass
[Image: X4]

## Part 2 — VIRKSS Coding

25% FAIL
[Image: X4]

FAIL
[Image: X4]

Overall Result

Completed in 25m 21s (of 110m allowed)
[Image: X4]

This was your final attempt. Please contact your administrator for further assistance.
[Image: X4]
[Image: X8]

| Score Breakdown |  |
| --- | --- |
| Coding | 5/20pts |
| Total | 5/20pts |

P e r f o r m a n c
[Image: X8]

C o d
[Image: X8]

2 5% a v g 2. 5

---

## S tre n

•C o rre c tly im p le m e n te d
p re v e n t s ta te u p d a te s o
c o m p o n e n ts, a d d re s s in
c o n c e rn.
[Image: X69]
[Image: X65]

[Image: X69] •P ro p e r u s e o f s e tS ta te w
m e rg e s ta te u p d a te s w h
im m u ta b ility.
[Image: X65]

## a A re a s to

•g I no cf oP mr opml ei tsee.saol ll(u) t fi oo nr — o n
i n pg a kr tnso_ wb lae nd dg ec owf e re le ft b
tim e m a n a g e m e n t is s u e s
th e fu ll ta s k.
o u n te d c h e c k to
[Image: X69]
[Image: X65]

n •mN oou ne tr er od r h a n d lin g fo r P ro
r e .acl amt cehm( )o or yr tlreya/ kc a tc h b lo
fe tc h fa ilu re s g ra c e fu lly
[Image: X69]
[Image: X65]

[Image: X69] s• pN roe aa dn sowp ee rr apt roor v tiod e d fo r
m ao inn tpa ri on di nugc t c a ta lo g filte rin
s ig n ific a n t g a p s in filte rin
im p le m e n ta tio n o r a v o id a
[Image: X65]

## W h a t to S tu

R e v ie w a s y n c e rro r h a n d lin g p a tte rn s in R e a c t
a s y n c /a w a it, a n d e rro r s ta te m a n a g e m e n t.
[Image: X65]

S tu d y R e a c t filte rin g a n d s e a rc h im p le m e n ta tio
filte rs w ith s ta te u p d a te s a n d p e rfo rm a n c e o p
[Image: X65]

3 P ra c tic e c o m p le tin g fu ll c o d in g a s s e s s m e n ts u n d e r tim e c o n s tra in ts — fo c u s o n ta c k lin g a ll

P ra c tic e c o m p le tin g fu ll c o d in g a s s e s s m e n ts u
p a rts o f m u lti-p a rt q u e s tio n s ra th e r th a n p a rtia
[Image: X65]
[Image: X71]

## PART 2 — VIRKSS INTERVIEW PROBLEMS

## V IR K

## SIn te rv ie w

dC eodd3/ e5
[Image: X71]

F /U2/ 5
[Image: X71]

# # R e a c t — P a rt 2 R o u n
[Image: X71]

## # # R e a c t — P a rt 2 R o u n

Y o u w ill wt wo or ki nodn e p e nidn et nh ti s t ar os uk ns d. B o th a re v is ib
S u b m i tc oy od ui nr g ai nn st hw ee re d ito r . bS r ue ba md tiht yaaons usarw ceor m m e
th e to p o f y o u r m a in file, p re fix e d w ith `// = = = P
[Image: X71]

a c tiv ity a n d n o tific a tio n p re fe re n c e s . A ll th re e d a ta s o u rc e s a re in d e p e n d e n t a n d c a n b e fe tc h e d
in p a ra lle l. T h e te a m n e e d s a p e rfo rm a n t s o lu tio n th a t h a n d le s lo a d in g s ta te s g ra c e fu lly a n d

---

## VIRKSS Assessment Platform

Implement a custom React hook that fetches use
using Promise.al l. The hook should support Reac
updates. Create a component that consumes this
appropriate loading and error boundaries.
[Image: X130]
[Image: X126]

### Requ
[Image: X130]
[Image: X126]

1. Create useUserDashboard hook that fetches
[Image: X130]
returns { profile, activity, preferences, isLoadin
[Image: X126]

re tu rn s { p ro file , a c tiv ity , p re fe re n c e s , is L o a d in g , e rro r }

2. Implement the component to use useTransitio
suspense-aware loading UI
[Image: X126]

3 . H a n d le e rro rs g ra c e fu lly : if a n y s in g le re q u e s t fa ils , th e e n tire fe tc h s h o u ld fa il a n d s u rfa c e

3. Handle errors gracefully: if any single reques
the error; supportretry via a reset function
[Image: X126]

### API C
[Image: X126]

-E n d p o` /i an pt :i / u s e rs /{u s e rId }, /a p i/u s e rs /{u s e rId }/a c tiv ity , /a p i/u s e rs /{u s e rId }/p re fe re n c e s `

-Endpo` /i an pt :i / u sers/{userId},/api/users/{userId}/ac
-Response` { s ph raopf ei l e: : UserProfile, activity: UserActiv
}`
[Image: X126]

### Starte
[Image: X126]
[Image: X132]

`src/api/us
[Image: X126]
[Image: X132]

```javascript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
}

export interface UserPreferences {
  id: string;
  notifications: boolean;
  theme: 'light' | 'dark';
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const fetchUserActivity = async (userId: string): Promise<UserActivity[]> => {
  const response = await fetch(`/api/users/${userId}/activity`);
  if (!response.ok) throw new Error('Failed to fetch activity');
  return response.json();
};

https://assessment-app.pages.dev/assessment/review

---

## VIRKSS Assessment Platform

```javascript
export const fetchUserPreferences = async (userId: string): Promise<UserPreferences> => {
  const response = await fetch(`/api/users/${userId}/preferences`);
  if (!response.ok) throw new Error('Failed to fetch preferences');
  return response.json();
};

```typescript
`src/hooks/useUserDashboard.ts`

import { useState, useEffect } from 'react';
import { fetchUserProfile, fetchUserActivity, fetchUserPreferences, UserProfile, UserActivity }

interface DashboardState {
  profile: UserProfile | null;
  activity: UserActivity[] | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserDashboard = (userId: string) => {
  const [state, setState] = useState<DashboardState>({
    profile: null,
    activity: null,
    preferences: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        // Implement parallel fetching here
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err : new Error('Unknown error'),
          }));
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [userId]);

const reset = () => {
  setState({
    profile: null,
    activity: null,
    preferences: null,
    isLoading: true,
    error: null,
  }
}
```

assessment-app.pages.dev/assessment/review

---

```javascript
    });
  };

  return { ...state, reset };
};

` sr c/ c omponent s/ U
[Image: X187]
[Image: X183]

```javascript
import React from 'react';
import { useUserDashboard } from '../hooks/useUserDashboard';

interface Props {
  userId: string;
}

export const UserDashboard: React.FC<Props> = ({ userId }) => {
  const { profile, activity, preferences, isLoading, error, reset } = useUserDashboard(userId)

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={reset}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>Email: {profile?.email}</p>
      <h2>Recent Activity</h2>
      <ul>
        {activity?.map((item) => (
          <li key={item.id}}{item.action}</li>
        ))}
      </ul>
      <h2>Preferences</h2>
      <p>Notifications: {preferences?.notifications ? 'On' : 'Off'}</p>
      <p>Theme: {preferences?.theme}</p>
    </div>
  );
};

## Par t B — Br e adt h T
[Image: X189] [Image: X185]

Wr i t e t hr e e RTL t e st s f o r t h e Sear c hFor m com
[Image: X189] [Image: X185]

---

## VIRKSS Assessment Platform

cl i c ks sear c h, and r e sul t s r e nder cor r e ct l y. ( 2) Lo
dur i n g async sear c h. ( 3) Er r o r st at e — ver i f y er r o
t hr o ws an er r or . Use user E vent f o r al li nt er a ct i o n
[Image: X215]
[Image: X211]

` sr c/ c omponent s/ S
[Image: X215]
[Image: X211]

```javascript
import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => Promise<{ results: string[] }> | { results: null }
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await onSearch(query);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search-input"
        />
        <button type="submit" data-testid="search-button">
          Search
        </button>
      </form>

      {isLoading && <p data-testid="loading-indicator">Searching...</p>}

      {error && <p data-testid="error-message" role="alert">{error}</p>}

      {results.length > 0 && (
        <ul data-testid="results-list">
          {results.map((result, index) => (
            <li key={index} data-testid="result-item">
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

---

```html
        )}
    </div>
  );
};

S u b my oi t u: r R T L t e s t c a s e s a s a c o m m e n t b l o c k a
w i t h `// = = = P a r t B A n s w e r = = = ` .
[Image: X242]
[Image: X238]

[Image: X242]
Y o u r A n s

PART A

```javascript
const [profile, activity, preferences] = await Promise.all([fetchUserProfile(userId),
fetchUserActivity(userId),
fetchUserPreferences(userId)]);

if (isMounted) {
    setState((prev) => ({
        ...prev,
profile, activity, preferences,
        isLoading: false,
        error:null
    }));
}
```

PART B

No code submitted

PART C

No code submitted

## M o d e l A n

```javascript
// === Part A - Coding Solution ===
`src/hooks/useUserDashboard.ts`

import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile, fetchUserActivity, fetchUserPreferences, UserProfile, UserActiv

interface DashboardState {
  profile: UserProfile | null;
  activity: UserActivity[] | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserDashboard = (userId: string) => {
  const [state, setState] = useState<DashboardState>({
    profile: null,
    activity: null,
    preferences: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

https://assessment-app.pages.dev/assessment/review

---

2 PM VIRKSS Assessment Platform

```javascript
const loadDashboard = async () => {
  try {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    const [profile, activity, preferences] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserActivity(userId),
      fetchUserPreferences(userId),
    ]);
    
    if (isMounted) {
      setState({
        profile,
        activity,
        preferences,
        isLoading: false,
        error: null,
      });
    }
  } catch (err) {
    if (isMounted) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      }));
    }
  }
};

loadDashboard();

return () => {
  isMounted = false;
};
}, [userId]);

const reset = useCallback(() => {
  setState({
    profile: null,
    activity: null,
    preferences: null,
    isLoading: true,
    error: null,
  });
}, []);

return { ...state, reset };
};

`src/components/UserDashboard.tsx`

import React, { useTransition } from 'react';
import { useUserDashboard } from '../hooks/useUserDashboard';

https://assessment-app.pages.dev/assessment/review

---

||7/12/26, 5:02 PM||VIRKSS Assessment Platform||||
|---|---|---|---|---|---|---|
||}; }});}; fields|reset();}); if (error) {return ( </div>); return (<div> <ul>))} </ul> </div> components blocking updates [https://assessment-app.pages.dev/assessment/review|const](https://assessment-app.pages.dev/assessment/review|const) handleRetry = () => {startTransition(() => {<div role="alert"> <p>Error: {error.message}</p> <button onClick={handleRetry}>Retry</button> if (isLoading || isPending) {return <p>Loading dashboard...</p>; <h1>{profile?.name}</h1> <p>Email: {profile?.email}</p> <h2>Recent Activity</h2> {activity?.map((item) => (<li key={item.id}>{item.action} at {item.timestamp}</li> <h2>Preferences</h2> <p>Notifications: {preferences?.notifications ? 'On' : 'Off'}</p> <p>Theme: {preferences?.theme}</p> // === Part A — Expected Signal === // - Uses Promise.all to fetch all three endpoints in parallel, not sequentially // - Implements proper cleanup (isMounted check) to prevent state updates on unmounted // - Returns structured state object with profile, activity, preferences, isLoading, error // - Provides reset function to allow retry after error // - Component uses useTransition or demonstrates awareness of concurrent rendering for non- // - Error handling: if any single request fails, entire hook fails (short-circuit behavior) // - Proper TypeScript typing throughout hook and component // Strong pass: Implements Promise.all correctly with proper cleanup and isMounted flag. Hook returns all required fields. Component renders loading/error/success states. Uses useTransition or demonstrates concurrent awareness. TypeScript is correct throughout. Reset function works. Error handling short-circuits on any failure. // === Part B — Breadth Solution (B9) === import React from 'react'; import {render, screen, waitFor} from '@testing-library/react'; import userEvent from '@testing-library/user-event'; import {SearchForm} from './SearchForm'; describe('SearchForm', () => {it('renders search results when query is submitted successfully', async () => {||9/19||

---

## VIRKSS Assessment Platform

7/12/26, 5:02 PM

VIRKSS Assessment Platform

```javascript
const user = userEvent.setup();
const mockResults = { results: ['React', 'Testing Library'] };
const mockOnSearch = jest.fn().mockResolvedValue(mockResults);

render(<SearchForm onSearch={mockOnSearch} />);

const input = screen.getByTestId('search-input');
const button = screen.getByTestId('search-button');

await user.type(input, 'testing');
await user.click(button);

await waitFor(() => {
    expect(screen.getByTestId('results-list')).toBeInTheDocument();
});

const items = screen.getAllByTestId('result-item');
expect(items).toHaveLength(2);
expect(items[8]).toHaveTextContent('React');
expect(items[1]).toHaveTextContent('Testing Library');
expect(mockOnSearch).toHaveBeenCalledWith('testing');
});

it('displays loading indicator while search is in progress', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ results: ['Result' }), 10
    ));

    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    await user.type(input, 'query');
    await user.click(button);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
});

it('displays error message when search fails', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    await user.type(input, 'query');
    await user.click(button);

    await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');
    expect(screen.queryByTestId('results-list')).not.toBeInTheDocument();
});

---

# VIRKSS Assessment Platform

// === Part B - Expected Signal ===
// - Test 1 (happy path): userEvent.type to fill input, userEvent.click to submit, await for async completion, assert results render with correct content
// - Test 2 (loading state): verify loading indicator is present during async operation, disappears after completion
// - Test 3 (error state): onSearch callback throws error, error message displays with correct text, input and button remain interactive
// - All tests use @testing-library/react and @testing-library/user-event
// - Proper use of screen queries (getByTestId, getByRole, queryByTestId) with appropriate async utilities (waitFor, findBy)
// - Mock onSearch callback with jest.fn() and set return values / side effects appropriately

## AI Feed

P a rt A : T h e c a n d id a te c o rre c tly im p le m e n te d th e c o re P ro m is e .a ll p a ra lle l fe tc h a n d th e

a re m is s in g e n tire ly (n o '// = = = P a rt B A n s w e r = = = ' b lo c k ), s c o rin g 0 fo r b re a d th , re s u ltin g

Part A: The candidate correctly im plemented th
isMounted guard for state updates, which is th
are missing entirely (no'// === Part B Answer =
in a blended code score of round(4×0.6 0 + 0×
a 3 given the correct Promise.all and isMounte
answers were shallow: the isMounted/userId c
lacked precision about race conditions; the Pro
and incomplete; the progressive loading answe
but lacked any mention of specific React patte
independent state slices.
[Image: X364]
[Image: X370]

a 3 g iv e n th e c o rre c t P ro m is e .a ll a n d is M o u n te d p a tte rn w ith p ro p e r s ta te u p d a te . F o llo w -u p
a n s w e rs w e re s h a llo w : th e is M o u n te d /u s e rId c h a n g e a n s w e r w a s d ire c tio n a lly c o rre c t b u t
la c k e d p re c is io n a b o u t ra c e c o n d itio n s ; th e P ro m is e .a ll v s a llS e ttle d a n s w e r w a s g a rb le d

b u t la c k e d a n y m e n tio n o f s p e c ific R e a c t p a tte rn s lik e u s e T ra n s itio n , S u s p e n s e , o r

## Pre-Coding C1 lqa ur ief iscat aisotkni e

a c o d in g p ro b le m w ith y o u to d a y . F e e l fre e to a s k a n y c la rify in g q u e s tio n s a b o u t th e p ro b le m
s ta te m e n t o r re q u ire m e n ts — a s k in g q u e s tio n s is a n im p o rta n t p a rt o f th e e v a lu a tio n p ro c e s s , s o d o n 't

Welcome to the technical interview. I'm your Virkss
a coding problem with you today. Feel free to ask an
statement or requirements — asking questions is an
hesitate to do so.
[Image: X370]

## Follow-up E3 xe cx hc ah sna

## ) §

`u s e rId ` c h a n g e s fro m 12 3 to 4 5 6 w h ile th o s e th re e fe tc h e s fro m th e firs t `P ro m is e .a ll` a re s till in -flig h t.

Yes, it works is Mounted is a local variable in the e
cleanup on the old closure first.
[Image: X370] [Image: X366]

---

## ) §

`fe tc h U s e rP re fe re n c e s `— fa ils w ith a 5 0 0 e rro r? H o w w o u ld th a t d iffe r if y o u 'd u s e d `P ro m is e .a llS e ttle d `

You chose `Promise.all` here. What would break if on
`fetchUserPreferences`— fails with a 5 0 0 error? How
instead, and when would you pick each?
[Image: X405]
[Image: X401]

## wˆ

promise allis even itif is one fail everything failes
[Image: X405]
[Image: X401]

## ) §

In p ro d u c tio n , th e s e th re e e n d p o in ts m ig h t h a v e d iffe re n t la te n c ie s — p ro file ta k e s 2 0 0 m s , a c tiv ity

[Image: X405] In production, these three endpoints might have diffe
takes 2s, preferences takes 10 0ms. Your componen
How would you approach this if the product team w
im mediately while activity loads in the background,
[Image: X401]

im m e d ia te ly w h ile a c tiv ity lo a d s in th e b a c k g ro u n d , a n d w h a t R e a c t p a tte rn s w o u ld y o u u s e ?

wˆ

splitthe fetches and have sep
[Image: X401]

AI gra
[Image: X401]

## VIRK

## SInterview

dC eodd0/ e5
[Image: X401]

F/U0/ 5
[Image: X401]

## React Co
[Image: X401]

Your team is building a product catalog dashbo
price range. The list re-renders frequently as filte
expensive to render (they fetch related recomm
renders using React.memo with a custom comp
[Image: X401]
[Image: X407]

c a llb a c k h a n d le rs m e a n in g fu lly c h a n g e . C re a te a c u s to m c o m p a ris o n fu n c tio n th a t ig n o re s
s h a llo w re fe re n c e c h a n g e s in c a llb a c k s w h ile p ro p e rly c o m p a rin g p ro d u c t p ro p e rtie s .
A d d itio n a lly , im p le m e n t a u s e P ro d u c tF ilte r h o o k th a t m a n a g e s filte r s ta te a n d re tu rn s a s ta b le

1. Wrap ProductCard in React.memo with a custo
product.id and product.price but uses function id
and onFavorite callbacks
2. Implement useProductFilter hook that returns
[Image: X407] [Image: X403]

2. Implement useProductFilter hook that return
(useCallback) so parent re-renders don't cau
[Image: X407] [Image: X403]

3 . D e m o n s tra te a w a re n e s s o f p e rfo rm a n c e tra d e -o ffs : a d d a c o m m e n t e x p la in in g w h y y o u
c h o s e y o u r c o m p a ris o n s tra te g y a n d w h e n th is m e m o iz a tio n h e lp s v s . w h e n it m a y b e

Additionally, im plement a useProductFilter hook
set of callbacks to prevent child re-renders cau
[Image: X407]

3. Demonstrate awareness of performance tra
chose your comparison strategy and when this
premature optimization
[Image: X407] [Image: X403]

### Requ
[Image: X407]

p ro d u c t.id a n d p ro d u c t.p ric e b u t u s e s fu n c tio n id e n tity c h e c k s (n o t d e e p e q u a lity ) fo r o n S e le c t

---

- E n d p o` Gi nEt T: / a p i / p r o d u c t s `
- R e s p o n s e` { s ph raopdeu: c t s : A r r a y < { i d : s t r i n g; n a m e : s
i s F a v o r i t e : b o o l e a n} >} `
# # # S t a r t e r C o d e
` s r c / h o o k s / u s e P r o d u c t F i l t e r . t s `
[Image: X447]
[Image: X443]

```typescript
import { useState, useCallback } from 'react';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isFavorite: boolean;
}

export function useProductFilter() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  return {
    filters,
    favorites,
    handleCategoryChange,
    handlePriceChange,
    handleToggleFavorite,
  }
```

assessment-app.pages.dev/assessment/review

---

```c
{ } ;
} }

` s r c / c o m p o n e n t s / P
[Image: X474]
[Image: X470]

```javascript
import React from 'react';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    isFavorite: boolean;
  };
  onSelect: (productId: string) => void;
  onFavorite: (productId: string) => void;
}

function ProductCardComponent(props: ProductCardProps) {
  const { product, onSelect, onFavorite } = props;

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', margin: '8px'
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button onClick={() => onSelect(product.id)}>View Details</button>
      <button
        onClick={() => onFavorite(product.id)}
        style={{ fontWeight: product.isFavorite ? 'bold' : 'normal' }}
      >
        {product.isFavorite ? '★' : '☆'} Favorite
      </button>
    </div>
  );
}

export const ProductCard = ProductCardComponent;

` s r c / c o m p o n e n t s
[Image: X476]

```javascript
import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useProductFilter, type Product } from '../hooks/useProductFilter';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop', price: 899, category: 'electronics', isFavorite: false },
  { id: '2', name: 'Mouse', price: 29, category: 'electronics', isFavorite: false },
  { id: '3', name: 'Desk Chair', price: 249, category: 'furniture', isFavorite: false },
  { id: '4', name: 'Monitor', price: 399, category: 'electronics', isFavorite: false },
];

export function ProductList() {

https://assessment-app.pages.dev/assessment/review const { filters, favorites, handleCategoryChange, handlePriceChange, handleToggleFavorite }
useProductFilter();

const filteredProducts = useMemo(() => {
  return MOCK_PRODUCTS.filter(
    (p) =>
      (filters.category === 'all' || p.category === filters.category) &&
      p.price >= filters.minPrice &&
      p.price <= filters.maxPrice
    ).map((p) => ({ ...p, isFavorite: favorites.has(p.id) }));
}, [filters, favorites]);

return (
<div>
  <h1>Product Catalog</h1>
  <div style={{ marginBottom: '20px' }}>
    <label>
      Category:
      <select value={filters.category} onChange={(e) => handleCategoryChange(e.target.value)}
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="furniture">Furniture</option>
      </select>
    </label>
    <label style={{ marginLeft: '20px' }}>
      Max Price: ${filters.maxPrice}
      <input
        type="range"
        min="0"
        max="1000"
        value={filters.maxPrice}
        onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))}
      />
    </label>
  </div>
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onSelect={() => console.log('Selected:', product.id)}
        onFavorite={handleToggleFavorite}
      />
    ))}
  </div>
</div>
);

Your Answer ^

No answer provided

Model Answer ^

// === Part A – Coding Solution ===
`src/hooks/useProductFilter.ts`

import { useState, useCallback } from 'react';

export interface FilterState {

---

PM VIRKSS Assessment Platform

```javascript
category: string;
minPrice: number;
maxPrice: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isFavorite: boolean;
}

export function useProductFilter() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) =>
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const handleToggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  return {
    filters,
    favorites,
    handleCategoryChange,
    handlePriceChange,
    handleToggleFavorite,
  };
}

`src/components/ProductCard.tsx`

```javascript
import React from 'react';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    isFavorite: boolean;

---

};
onSelect: (productId: string) => void;
onFavorite: (productId: string) => void;
}

function ProductCardComponent(props: ProductCardProps) {
  const { product, onSelect, onFavorite } = props;

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', margin: '8px' }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button onClick={() => onSelect(product.id)}>View Details</button>
      <button
        onClick={() => onFavorite(product.id)}
        style={{ fontWeight: product.isFavorite ? 'bold' : 'normal' }}
      >
        {product.isFavorite ? '★' : '☆'} Favorite
      </button>
    </div>
  );
}

function arePropsEqual(
  prevProps: ProductCardProps,
  nextProps: ProductCardProps
): boolean {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.isFavorite === nextProps.product.isFavorite &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onFavorite === nextProps.onFavorite
  );
}

export const ProductCard = React.memo(ProductCardComponent, arePropsEqual);

`src/components/ProductList.tsx`

import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useProductFilter, type Product } from '../hooks/useProductFilter';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop', price: 899, category: 'electronics', isFavorite: false },
  { id: '2', name: 'Mouse', price: 29, category: 'electronics', isFavorite: false },
  { id: '3', name: 'Desk Chair', price: 249, category: 'furniture', isFavorite: false },
  { id: '4', name: 'Monitor', price: 399, category: 'electronics', isFavorite: false },
];

export function ProductList() {
  const { filters, favorites, handleCategoryChange, handlePriceChange, handleToggleFavorit
    useProductFilter();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (p) =>
        (filters.category === 'all' || p.category === filters.category) &&
        p.price >= filters.minPrice &&
        p.price <= filters.maxPrice
    )
  });
}

---

7/12/26, 5:02 PM VIRKSS Assessment Platform ).map((p) => ({ ...p, isFavorite: favorites.has(p.id) })); }, [filters, favorites]);

return ( <div> <h1>Product Catalog</h1> <div style={{ marginBottom: '20px' }}> <label> Category: <select value={filters.category} onChange={(e) => handleCategoryChange(e.target. <option value="all">All</option> <option value="electronics">Electronics</option> <option value="furniture">Furniture</option> </select> </label> <label style={{ marginLeft: '20px' }}> Max Price: ${filters.maxPrice} <input type="range" min="0" max="1000" value={filters.maxPrice} onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))} /> </label> </div> <div style={{ display: 'flex', flexWrap: 'wrap' }}> {filteredProducts.map((product) => ( <ProductCard key={product.id} product={product} onSelect={() => console.log('Selected:', product.id)} onFavorite={handleToggleFavorite} /> ))} </div> </div> ); }

// === Part A — Expected Signal === // - Correctly implements React.memo with custom arePropsEqual that compares product.id and product.price but checks callback function identity // - Uses useCallback in useProductFilter hook to memoize callbacks so they maintain referential equality across parent re-renders // - Provides a thoughtful comment explaining the performance trade-off: when memoization prevents re-renders (expensive renders, frequent parent updates) vs. when it adds overhead (shallow comparisons, infrequent updates) // - Demonstrates understanding that function identity matters in memoization and that callbacks must be stabilized upstream to make memo effective // - Code is syntactically valid TypeScript/React 18 and compiles without errors // Strong pass: Candidate implements React.memo with a custom arePropsEqual that correctly compares product.id and product.price while using function identity checks for callbacks. useProductFilter returns useCallback-wrapped callbacks that maintain referential equality. A clear, specific comment explains the performance trade-off (e.g., when frequent parent updates + expensive child renders make memoization worthwhile). Code is clean, idiomatic, and compiles. Candidate demonstrates confidence in the memoization strategy.

A I F e e d b a c k

[https://assessment-app.pages.dev/assessment/review](https://assessment-app.pages.dev/assessment/review) 18/19

---

No code submitted and no fo
[Image: X629]
[Image: X627]