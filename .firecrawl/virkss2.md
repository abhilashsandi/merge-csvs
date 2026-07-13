0%
[Image: X4]

FAIL
[Image: X4]

Keep practicing!
[Image: X4]

| 0% | 60% pass | 100% |
| --- | --- | --- |
| Part 1一MCQ&amp;Aptitude | 0% | FAIL |
| Part2一VIRKSS Coding | 0% | FAIL |
| Overall Result | FAIL |  |
| Completed in 34s(of 110m allowed) |  |  |

This was your final attempt. Please contact your administrator for further assistance.

Cod
[Image: X8]

| Score Breakdown |  |
| --- | --- |
| MCQ | 0/30pts |
| Coding | 0/20pts |
| Theory | 0/40pts |
| Total | 0/90pts |

## Performanc

e• Nd o— acssa en sd si dma et entd oi df knowle
lack of responses. The c
blank answers across all
theory, and coding sectio
[Image: X8] [Image: X6]

---

evaluation of conceptu
problem-solving ability
[Image: X78]
[Image: X74]

What to Stu
[Image: X78]
[Image: X74]

React controlled vs. uncontrolled comp
[Image: X78]
[Image: X74]

1 R e a c t c o n tro lle d v s . u n c o n tro lle d c o m p o n e n ts a n d fo rm s ta te m a n a g e m e n t
2 R e a c t R o u te r v 6 a d v a n c e d p a tte rn s (n e s te d ro u te s , d y n a m ic ro u tin g , w iz a rd w o rk flo w s )
3 R e a c t T e s tin g L ib ra ry b e s t p ra c tic e s a n d c o m m o n te s tin g a n ti-p a tte rn s

[Image: X78]
React Router v6 advanced patterns (nested
[Image: X74]

React Testing Library best practices
[Image: X74]

Custom hooks design patterns and
[Image: X74]

5 D e b o u n c in g /th ro ttlin g fo r s e a rc h in te rfa c e s a n d p e rfo rm a n c e o p tim iz a tio n

Debouncing/throttling for search interfa
[Image: X74]

PART 1 — MCQ & APTITUDE
[Image: X74]

## THEO

E x p la in th e tra d e -o ffs b e tw e e n c o n tro lle d a n d u n c o n tro lle d c o m p o n e n ts in R e a c t.
W h e n w o u ld y o u u s e e a c h p a tte rn , a n d w h a t a re th e im p lic a tio n s fo r te s tin g , fo rm

ˇ• § ˛ ⁄ ˛ Yˆ ˛ Ø ˛ ˆ ˆ••
p⁄ ˛Øˆ • ˛ ˆ ˛ ˛ ⁄˛ˇ k˛ ˛Ø
ˆ»ˇ• § k˛ ˛ˇ ˆ » C
[Image: X74]
[Image: X80]

Your Ans
[Image: X80]

=ˆ˛ Ø
[Image: X80]

## Model An

**Controlled Components:****
- React state drives input value; every keystroke triggers a state update and re-render.
- Pros: Predictable, testable (query state directly), enables real-time validation, can disable submit button conditionally, integrates with form libraries (React Hook Form, Formik).
- Cons: More boilerplate (onChange handlers for each field), potential performance issues if re-renders are not optimized (especially large forms), every input change causes parent re-render.

**Uncontrolled Components:****
- DOM holds the source of truth; React reads values via refs when needed (e.g., on submit).
- Pros: Less boilerplate, faster initial render (no state updates per keystroke), simpler for simple forms, integrates easily with non-React code.
- Cons: Harder to test (must query DOM directly), no real-time validation without manual event listeners, can't conditionally disable submit button based on input state, form state is implicit.

**When to use each:****
- **Controlled**: Forms with validation, multi-field dependencies, dynamic field enable/disable, autosave, or complex state logic. Standard for modern React apps.
- **Uncontrolled**: Simple forms (login, search), file inputs (inherently uncontrolled), integration with third-party libraries, or when performance is critical and re-renders must be minimized.

---

# VIRKSS Assessment Platform

**Testing implications:**
- Controlled: Query state via `useContext` or props; assert state changes directly.
- Uncontrolled: Must query DOM values via `getByDisplayValue` or refs; more brittle.

**Performance implications:**
- Controlled: Each keystroke triggers parent re-render. Mitigate with `useMemo`,
`useCallback`, or form library memoization.
- Uncontrolled: No re-renders during input; only on submit. Better for very large forms without real-time validation.

## Explan

A s tro n g a n s w e r c le a rly a rtic u la te s th e tra d e -o ff: c o n tro lle d = p re d ic ta b ility + te s ta b ility +
re a l-tim e fe a tu re s a t th e c o s t o f b o ile rp la te a n d p o te n tia l re -re n d e r o v e rh e a d ; u n c o n tro lle d
= s im p lic ity + p e rfo rm a n c e a t th e c o s t o f te s ta b ility a n d re a l-tim e fe a tu re s . T h e y s h o u ld
p ro v id e s p e c ific e x a m p le s (e .g ., 'u s e c o n tro lle d fo r a u to s a v e , u n c o n tro lle d fo r s im p le
lo g in '). F o r th e fo llo w -u p , a s tro n g c a n d id a te re c o g n iz e s th a t a 5 0 -fie ld fo rm w ith re a l-tim e
v a lid a tio n * m u s t* b e c o n tro lle d (to e n a b le c o n d itio n a l v a lid a tio n ) a n d w o u ld u s e a fo rm
lib ra ry lik e R e a c t H o o k F o rm to m in im iz e re -re n d e rs v ia fie ld -le v e l s u b s c rip tio n s . W e a k
a n s w e rs c o n fla te th e p a tte rn s , c la im o n e is u n iv e rs a lly b e tte r, o r d o n 't a d d re s s th e
p e rfo rm a n c e im p lic a tio n s o f 5 0 c o n tro lle d fie ld s . S e n io r c a n d id a te s s h o u ld m e n tio n fo rm
lib ra rie s a s a w a y to g e t c o n tro lle d -c o m p o n e n t b e n e fits (v a lid a tio n , s ta te m a n a g e m e n t)

A strong answer clearly articulates the trade-o
real-tim e features at the cost of boilerplate an
= sim plicity + performance at the cost of testa
provide specific examples (e.g.,'use controlle
login'). For the follow-up, a strong candidate re
validation *must* be controlled (to enable con
library like React Hook Form to minimize re-re
answers conflate the patterns, claim one is un
performance im plications of 5 0 controlled field
libraries as a way to get controlled-componen
without full-tree re-renders on every keystroke
[Image: X138]

## THEO

AI gr a 0d /e1d0
[Image: X138]
[Image: X144]

Design a React Router v6 route table for a multi-step wizard application with the following structure: **Components/Contexts:**** - `App` (root layout) -
`WizardLayout` (wrapper for all wizard steps, holds shared state) - `StepOne`,
`StepTwo`, `StepThree`, `StepFour` (wizard steps, lazy-loaded) - `WizardConfirm`
(final review before submission) - `WizardSuccess` (post-submission success page) - `PublicHome` (public landing page) - `AdminDashboard` (protected, requires auth) - `NotFound` (404 fallback) - `WizardGuard` (context-based leave-confirmation guard) **Requirements:**** - Wizard steps are nested under `/wizard/*` with shared layout. - Wizard has a leave-confirmation guard that prevents navigation away if form is dirty. - AdminDashboard requires authentication; unauthenticated users redirect to '/'. - All wizard steps and success page should be code-split (lazy). - Provide a route table with path, element, loader, lazy, and guard wrapper decisions. - Justify your architectural choices (why lazy? why this guard placement?).

Your Ans
[Image: X144]

=ˆ˛ Ø
[Image: X144] [Image: X140]

Model An
[Image: X144] [Image: X140]

---

**Route Table (React Router v6):**

...

path: '/' | element: <App /> | children: [
  { path: '', | element: <PublicHome /> },
  { path: 'wizard', | element: <WizardGuard><WizardLayout /></WizardGuard> |
  children: [
    { path: 'step1', | lazy: () => import('./StepOne').then(m => ({ Component:
m.default })) },
    { path: 'step2', | lazy: () => import('./StepTwo').then(m => ({ Component:
m.default })) },
    { path: 'step3', | lazy: () => import('./StepThree').then(m => ({ Component:
m.default })) },
    { path: 'step4', | lazy: () => import('./StepFour').then(m => ({ Component:
m.default })) },
    { path: 'confirm', | lazy: () => import('./WizardConfirm').then(m => ({ Component:
m.default })) },
    { path: 'success', | lazy: () => import('./WizardSuccess').then(m => ({ Component:
m.default })) }
  ] },
  { path: 'admin', | element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
},
{ path: '*', | element: <NotFound /> }
]
...

**Architectural Justification:****

1. **Lazy loading for wizard steps**: Each step is code-split because users typically enter at step 1; loading all steps upfront wastes bandwidth. Lazy boundaries reduce initial bundle size.

2. **WizardGuard wraps WizardLayout (not individual steps)**: The guard is placed at the wizard root, not per-step. This prevents re-mounting the guard on each step transition and ensures a single dirty-state check applies to the entire wizard flow.

3. **Nested children under `/wizard`**: Keeps wizard routes grouped logically and allows shared layout/context (WizardLayout) to persist across step transitions without remounting.

4. **ProtectedRoute wrapper for AdminDashboard**: Authentication check is a layout-level concern; wrapping the element (not using a loader) allows synchronous redirect logic. Alternatively, a loader could check auth and redirect before rendering.

5. **Fallback `path:` *`*` at root**: Catches undefined routes and renders NotFound; must be last in the route array.

A s tro n g a n s w e r p ro d u c e s a v a lid ro u te ta b le w
c h ild re n n e s tin g, e le m e n t w ra p p in g) a n d ju s tifie
p e rfo rm a n c e) a n d w h y th e g u a rd w ra p s th e la
m o u n tin g). T h e y s h o u ld a ls o e x p la in th a t th e g
n a v ig a tio n u s in g `u s e B lo c k e r` o r a c u s to m h o o
in d iv id u a l s te p s (in e ffic ie n t), fa il to u s e la z y () s
d e c is io n s. S e n io r c a n d id a te s s h o u ld a rtic u la te
a v a ila b ility b u t im p ro v e s in itia l lo a d tim e, a n d g
d irty-s ta te c h e c k s ru n.
[Image: X180] [Image: X176]

## E x p la n

A s tro n g a n s w e r p ro d u c e s a v a lid ro u te ta b le w ith c o rre c t s y n ta x (la z y im p o rt p a tte rn ,

---

## THEO

AI gr a 0d /e1d0
[Image: X204]
[Image: X200]

A team wrote this RTL test for a form component. Walk through it and identify every bug. Explain why each one causes the test to fail or pass incorrectly. test('user can submit form', () $ \Rightarrow $ { render(<LoginForm onSubmit={jest.fn()} />); const emailInput = screen.getByLabelText('Email'); const submitButton = screen.getByRole('button', { name: /submit/i }); fireEvent.change(emailInput, { target: { value: 'test@example.com' } }); fireEvent.click(submitButton); expect(emailInput.value).toBe('test@example.com'); });

Your Ans

=ˆ˛ Ø
[Image: X200]

## Model An

Five bugs in this test:

1. **Targeting label instead of input (wrong element)**: `getByLabelText('Email')` returns the `<label>` element, not the `<input>`. `fireEvent.change` on a label does nothing. Should use `getByRole('textbox', { name: /email/i })` or ensure the label is associated via `htmlFor` and the input has matching `id`, then query the input directly.

2. **fireEvent instead of userEvent**: `fireEvent.change` and `fireEvent.click` bypass the browser's event system. Should use `await userEvent.type(emailInput, 'test@example.com')` and `await userEvent.click(submitButton)` for realistic user interactions.

3. **No await on async actions**: If onSubmit is async or triggers state updates, the test doesn't wait for completion. Should `await` userEvent calls and wrap assertions in `waitFor` if needed.

4. **Asserting input.value instead of onSubmit call**: The test verifies the input still has the value, which is trivial. Should assert `expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@example.com' }))` to verify the callback was invoked correctly.

5. **No validation of form submission side effects**: Doesn't verify the form actually submitted (e.g., success message, redirect, loading state cleared). Should add assertions on post-submission behavior.

## Explan

A s tro n g a n s w e r id e n tifie s th e la b e l-ta rg e tin g b u g a s th e c ritic a l o n e (b u g # 1) a n d e x p la in s
th e s e m a n tic d iffe re n c e : la b e ls a re n o t fo rm c o n tro ls . T h e y s h o u ld a ls o re c o g n iz e th a t

la b e l is s u e e n tire ly , tre a t a ll b u g s a s e q u a lly im p o rta n t, o r d o n 't e x p la in * w h y * e a c h b u g u s e S ta te < E rro r | n u ll> (n u l l) ; u s e E ffe c t(() => { s e tL o a d in g (tru e );

You have this custom hook that fetches user data asynchronously: const useUserData = (userId: string) $ \Rightarrow $ { const [user, setUser] = useState<User | null> (null); const [loading, setLoading] = useState(false); const [error, setError] = useState<Error | null>(null); useEffect(() $ \Rightarrow $ { setLoading(true); fetchUser(userId).then(data $ \Rightarrow $ { setUser(data); setLoading(false); }).catch(err $ \Rightarrow $ { setError(err); setLoading(false); }); }, [userId]); return { user, loading, error }; }; A component uses this hook and renders user.name when user is loaded. Enumerate the RTL test cases you would write to validate this hook's behavior, prioritized by signal value (most important first).

Your Ans

=ˆ˛ Ø
[Image: X227]

## Model An

A strong answer prioritizes tests in this order:

1. **Happy path with waitFor + findBy**: Component renders user name after async resolution. Use `await screen.findByText(user.name)` to verify the hook resolved and re-rendered. This is highest signal-validates the entire async flow.

2. **Loading state during fetch**: Component shows loading indicator while request is pending. Use `screen.getByText(/loading/i)` immediately, then `waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument())` after resolution.

3. **Error state on rejection**: Mock fetchUser to reject, verify error message appears using `await screen.findByText(/error/i)`. Validates error path and cleanup.

4. **Re-fetch on userId change**: Render with userId='1', verify user.name appears. Change userId to '2', use `waitFor` to confirm new user.name renders (not old one). Validates dependency array correctness.

5. **Loading state clears on error**: Verify loading becomes false even when error occurs (not stuck in loading=true).

6. **No memory leak on unmount during fetch**: Render, unmount before fetch completes, verify no console warnings about setState on unmounted component.

## Explan

A s tro n g a n s w e r id e n tifie s th e a s y n c -s ta te -u p d a te p a tte rn a s th e c o re te s tin g c h a lle n g e a n d

A strong answer identifies the async-state-upd
prioritizes by coverage of the ho→o sk t'as t ecou np→tdrr eaa c-t et :s a
render. Weak answers either list tests in arbitra
entirely, or focus on low-signal cases like'user
test matters. Strong candidates also mention cle
dependency correctness (re-fetch on userId ch
[Image: X233] [Image: X229]

re n d e r. W e a k a n s w e rs e ith e r lis t te s ts in a rb itra ry o rd e r, m is s th e `w a itF o r`/`fin d B y ` p a tte rn
e n tire ly , o r fo c u s o n lo w -s ig n a l c a s e s lik e 'u s e r is n u ll in itia lly ' w ith o u t e x p la in in g w h y e a c h
te s t m a tte rs . S tro n g c a n d id a te s a ls o m e n tio n c le a n u p (u n m o u n t d u rin g fe tc h ) a n d
d e p e n d e n c y c o rre c tn e s s (re -fe tc h o n u s e rId c h a n g e ), s h o w in g d e p th in a s y n c te s tin g .

---

|7/12/26, 4:12 PM||VIRKSS Assessment Platform||||
|---|---|---|---|---|---|
|5 W h b u s e c o n < in o n C A. a n B. c o C. s w D. b e E x p In w p re c o d o 6 W h A. B. C. D. E x p S u s h|M C Q a t is tto n ? tC o n tro p u t lic k T h e e m p T h e n tro T h e itc h e T h e c o m la n a itia lly ith a n s e n n tro l e s n M C Q e n d W h e W h e O n ly W h e la n a s p e n o w s [https://assessment-app.pages.dev/assessment/review|th](https://assessment-app.pages.dev/assessment/review|th) e o u tp u t w h e n th is c o m p o ``` fu n c tio n F o rm () {c o n s t [v tro lle d] = u s e S ta te (tru e); c o n lle d ? {v a lu e, o n C h a n g e : (e) re f= {in p u tR e f} {...in p u tP ro p s = {() => s e tC o n tro lle d (!c o n tro in p u t d is p la y s 'u n c o n tro lle d '; a fte ty s trin g in p u t d is p la y s a n e m p ty s trin g; a lle d in p u t d is p la y s 'u n c o n tro lle d '; a fte s fro m u n c o n tro lle d to c o n tro lle d in p u t d is p la y s a n e m p ty s trin g; a e s u n c o n tro lle d tio n `c o n tro lle d ` is tru e, s o `v a lu e ` a n e m p ty `v a lu e `. H o w e v e r, `d e fa u t, s o th e in p u t s h o w s e m p ty. O n c le d p ro p s, a n d R e a c t p re s e rv e s th o t e rro r b e c a u s e th e to g g le h a p p o e s a S u s p e n s e b o u n d a ry d n e v e r a n y c h ild c o m p o n e n t c a lls n a c h ild c o m p o n e n t th ro w s a p ro w h e n th e e n tire c o m p o n e n t tre e n a c h ild c o m p o n e n t u s e s `u s e T tio n s e c a tc h e s p ro m is e s th ro w n b y a th e fa llb a c k u n til th e p ro m is e re s|— /1 0 n e n t firs a lu e, s e s t in p u tR => s e tV a} d e fa u lle d)}> T r c lic k in g C o rre c fte r c lic k r c lic k in g fte r c lic k d `o n C h a ltV a lu e ` is lic k, `c o n e D O M 's e n s a fte r — /1 0 is p la y its `u s e S ta te r tr h e ca tt m iC s eo fa ils to re ra n s itio n ` s y n c d a o lv e s. O p|t tV lu ltV o, t in g, in g n g ig c m ` n a n ta tio 7/20|re a e f e (e a lu g g it b, it it, it e ` n o tro lle u o u fa o r h a s d e d s o n|

nders and the user clicks the lue] = useState(''); const [controlled, = useRef(nul l); const inputProps = .target.value)} : {};return ( <> e="uncontrolled" /> <button le</button> </>);} ```

|e c o m|e s c|o n tro|lle d|a n d|d is p la|y s||
|---|---|---|---|---|---|---|---|
|d is p|la y s|'u n c o|n tro|lle d '|a n d re|m a in|s|
|ro w|s a n|e rro r|b e c|a u s e|th e in|p u t||
|d is p|la y s|a n e m|p ty|s trin|g a n d|th e|in p u|
|a re s|p re a|d in,|m a k|in g it|c o n tro|lle d||
|re d w|h e n|c o n|tro lle|d p ro|p s a re|||
|d ` flip|s to|fa ls|e, re|m o v in|g th|e||
|n t te|x t (s|till e|m p ty|). T h|e c o m|p o n|e n t|

th

t

rre nt.

llback component in React 18? `useReducer` not yet resolved r due to an error boundary `isPending` is true

urces (via lazy, data libraries, etc.) and A describes state hooks (not

---

Suspense triggers). Option C conflates Suspen
`useTransition` UI feedback, not Suspense beh
[Image: X306]
[Image: X302]

## MC

A test uses `screen.getByLabelText('Email')` to query a form field, but the test fails with 'Unable to find a label with the text of: Email'. The markup is: ``` <label htmlFor="email-input">Email</label> <input id="email-input" type="text" /> ``` Which line is the bug?

A. The label element;it should
[Image: X302]

B. The input element;it should have `nam
[Image: X302]

C. The test query; it should use `screen.g
instead
[Image: X302]

tByR
Corre
[Image: X302]

D . T h e la b e l a n d in p u t a re c o rre c tly a s s o c ia te d ; th e te s t e n v iro n m e n t is m is c o n fig u re d

D. The label and input are correctly associate
[Image: X302]

## Explan

`g e tB y L a b e lT e x t` re q u ire s th e la b e l te x t to e x a c tly m a tc h a n d th e a s s o c ia tio n to b e c o rre c t;
h e re th e a s s o c ia tio n is v a lid b u t `g e tB y R o le ` is m o re ro b u s t fo r a c c e s s ib le q u e rie s . O p tio n s A
a n d B m is id e n tify th e a c tu a l m a rk u p (w h ic h is c o rre c t). O p tio n D ig n o re s th a t th e te s t

`getByLabelText`requires the label text to exac
here the association is valid but `getByRole` is m
and B misidentify the actual markup (which is c
[Image: X302]
environment is standard.
[Image: X308]

## PART 2 — VIRKSS INTERVIEW PROBLEMS

You will wt wo or ki nodn e penidnet nhti s t ar os uk nsd. Both are visib
Submi tc oyod ui nr g ai nnst hw eere ditor . bS r ue ba mdtihtyaaons usarw ceor m me
the top of your main file, prefixed with `// === P
[Image: X308] [Image: X304]

## ## React — Part 2 Roun

---

# VIRKSS Assessment Platform

Router's useBlocker hook, integrated with a cus
the confirmation UI.
[Image: X357]
[Image: X353]

### T
[Image: X357]

d e te c t u n s a v e d c h a n g e s a n d b lo c k n a v ig a tio n ; th e c o m p o n e n t m u s t d is p la y a c o n firm a tio n
d ia lo g w h e n th e u s e r a tte m p ts to le a v e . H a n d le b o th th e h a p p y p a th (u s e r c o n firm s d e p a rtu re )

Implement a useFormGuard hook and integrate
detect unsaved changes and block navigation; th
dialog when the user attempts to leave. Handle b
[Image: X357]
and the case where the user cancels.
[Image: X353]

### Requ
[Image: X353]

## ### Requ

1. Create a useFormGuard hook that tracks form
navigation when changes are unsaved.
[Image: X353]

2 . Im p le m e n t a F o rm E d ito r c o m p o n e n t th a t u s e s th e h o o k , d is p la y s a c o n firm a tio n d ia lo g o n
b lo c k , a n d a llo w s th e u s e r to c o n firm o r c a n c e l th e d e p a rtu re .

2. Implement a FormEditor component that use
block, and allows the user to confirm or cancel
[Image: X353]

3. Ensure the blocker is cleared when the form
after confirming.
[Image: X353]

## ### API C

-Endpo` Pi nOt :S T /api/d
[Image: X353]
[Image: X359]

-R e s p o n s e` { s ihd a: ps e t r :i n g ; title : s trin g ; d e s c rip tio n : s trin g ; s a v e d A t: s trin g }`

-Response` { s ihd a: ps et r :i n g; title: string; descrip
[Image: X353]
[Image: X359]

### Starte
[Image: X353]
[Image: X359]

`src/hooks/use
[Image: X359]

```javascript
import { useBlocker } from 'react-router-dom';
import { useState, useCallback } from 'react';

export interface FormGuardState {
  isDirty: boolean;
  isBlocked: boolean;
  blocker: any;
}

export const useFormGuard = (): FormGuardState => {
  const [isDirty, setIsDirty] = useState(false);

  const blocker = useBlocker(() => isDirty);

  return {
    isDirty,
    isBlocked: blocker.state === 'blocked',
    blocker,
  };
};

---

` s r c / c o m p o n e n t s
[Image: X383]
[Image: X379]

```javascript
import React, { useState } from 'react';
import { useFormGuard } from '../hooks/useFormGuard';

interface FormData {
  title: string;
  description: string;
}

export const FormEditor: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
  });

  const { isDirty, isBlocked, blocker } = useFormGuard();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

return (
  <div>
    <h1>Form Editor</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <button type="submit">Save</button>
    </form>
    {isBlocked && (
      <div>
        <p>You have unsaved changes. Are you sure you want to leave?</p>
        <button>Cancel</button>
        <button>Leave</button>
      </div>
    )}
  </div>
);
};

---

## Part B — Breadth Ta
[Image: X409]
[Image: X405]

W rite th re e R T L te s ts fo r th e S u b s c rip tio n F o rm c o m p o n e n t: (1) a h a p p y -p a th te s t th a t v e rifie s

Write three RTL tests for the SubscriptionForm c
successful submission clears the input and calls
state is displayed during submission, and (3) an
displayed and onError is called when the API fails
[Image: X409]
[Image: X405]

s ta te is d is p la y e d d u rin g s u b m is s io n , a n d (3 ) a n e rro r-s ta te te s t th a t v e rifie s e rro r m e s s a g e s a re

[Image: X409]
`src/components/Sub
[Image: X405]

```javascript
import React, { useState } from 'react';

interface SubscriptionFormProps {
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      const data = await response.json();
      setEmail('');
      onSuccess?.(data.email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}

---

```html
    placeholder="Enter your email"
    disabled={isLoading}
    required
  />
  <button type="submit" disabled={isLoading}>
    {isLoading ? 'Subscribing...' : 'Subscribe'}
  </button>
  {error && <div role="alert">{error}</div>}
</form>
);
};

Submyoi t u: r RTL t e st cases as a comment bl o ck a
wi t h `// === Par t B Answer ===` .
[Image: X432]

Your Ans

=ˆ˛ Ø
[Image: X432]

## Model An

```javascript
// === Part A - Coding Solution ===
`src/hooks/useFormGuard.ts`

```javascript
import { useBlocker } from 'react-router-dom';
import { useState, useCallback } from 'react';

export interface FormGuardState {
  isDirty: boolean;
  isBlocked: boolean;
  proceed: () => void;
  reset: () => void;
  setIsDirty: (dirty: boolean) => void;
}

export const useFormGuard = (): FormGuardState => {
  const [isDirty, setIsDirty] = useState(false);

  const blocker = useBlocker(() => isDirty);

  const proceed = useCallback(() => {
    blocker.proceed?.();
  }, [blocker]);

  const reset = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  return {
    isDirty,
    isBlocked: blocker.state === 'blocked',
    proceed,
    reset,
    setIsDirty,
  };
};

---

```javascript
'src/components/FormEditor.tsx'

import React, { useState } from 'react';
import { useFormGuard } from '../hooks/useFormGuard';

interface FormData {
  title: string;
  description: string;
}

export const FormEditor: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const { isDirty, isBlocked, proceed, reset, setIsDirty } = useFormGuard();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAr>
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsDirty(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmLeave = () => {
    proceed();
  };

  const handleCancelLeave = () => {
    reset();
  };

  return (
    <div>
      <h1>Form Editor</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          disabled={isSaving}
        />
        <textarea
          name="description"
          value={formData.description}

---

```html
    onChange={handleInputChange}
    placeholder="Description"
    disabled={isSaving}
  />
  <button type="submit" disabled={isSaving || !isDirty}>
    {isSaving ? 'Saving...' : 'Save'}
  </button>
</form>
{isBlocked && (
  <div role="alertdialog" aria-labelledby="confirm-dialog-title">
    <p id="confirm-dialog-title">You have unsaved changes. Are you sure you want to
    <button onClick={handleCancelLeave}>Cancel</button>
    <button onClick={handleConfirmLeave}>Leave Anyway</button>
  </div>
)}
</div>
);
};

// === Part A - Expected Signal ===
// - Candidate connects isDirty state to useBlocker predicate correctly.
// - Candidate implements blocker.proceed() and blocker.reset() to handle user confirmation/cancellation.
// - Candidate clears isDirty after successful form submission.
// - Candidate demonstrates understanding of when blocker state transitions (idle $ \rightarrow $ blocked $ \rightarrow $ idle).
// - Candidate considers performance: isDirty state is minimal and blocker is only active when needed.
// Strong pass: Candidate implements useFormGuard with correct blocker integration, properly tracks isDirty, handles both confirmation and cancellation paths, and clears the blocker after submission. Code is idiomatic React, uses TypeScript correctly, and demonstrates awareness of blocker state lifecycle.

// === Part B - Breadth Solution (B9) ===

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubscriptionForm } from './SubscriptionForm';

describe('SubscriptionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully subscribe and call onSuccess callback', async () =>
    const onSuccess = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      })
    ) as jest.Mock;

    render(<SubscriptionForm onSuccess={onSuccess} />);

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('test@example.com');

https://assessment-app.pages.dev/assessment/review

---

2/26, 4:12 PM VIRKSS Assessment Platform

```javascript
});

expect(input).toHaveValue('');
});

test('should display loading state during submission', async () => {
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve({ email: 'test@example.com' }),
            }),
            100
        )
      )
    ) as jest.Mock;

render(<SubscriptionForm />);

const input = screen.getByPlaceholderText('Enter your email');
const button = screen.getByRole('button', { name: /subscribe/i });

fireEvent.change(input, { target: { value: 'test@example.com' } });
fireEvent.click(button);

expect(button).toHaveTextContent('Subscribing...');
expect(button).toBeDisabled();
expect(input).toBeDisabled();

await waitFor(() => {
  expect(button).toHaveTextContent('Subscribe');
  expect(button).not.toBeDisabled();
});
});

test('should display error message and call onError callback on failure', async () => {
  const onError = jest.fn

---

# VIRKSS Assessment Platform

// === Part B - Expected Signal ===
// - Candidate uses render, screen, fireEvent (or userEvent) to interact with the form.
// - Candidate properly mocks fetch using jest.mock or MSW.
// - Candidate uses waitFor to handle async operations.
// - Happy-path test: form submission succeeds, input is cleared, onSuccess callback is called with correct email.
// - Loading test: button shows 'Subscribing...' text and is disabled during submission.
// - Error test: error message is displayed in the alert, onError callback is called, input is not cleared.

AI Feed
[Image: X550]

## AI Feed

No code submitted and no fo
[Image: X550]

## VIRK

## SInterview

dC eodd0/ e5
[Image: X550]

## React Co
[Image: X550]

## ## React Co

Y o u r te a m is b u ild in g a re a l-tim e s e a rc h in te rfa c e fo r a p ro d u c t c a ta lo g . U s e rs c a n ty p e to filte r

Your team is building a real-tim e search interface
thousands of items, but the search input must re
renders of the filtered results list. You need to im
prioritizes user input over list updates.
[Image: X550]
[Image: X556]

re n d e rs o f th e filte re d re s u lts lis t. Y o u n e e d to im p le m e n t d e fe rre d re n d e rin g s o th e U I

### T
[Image: X556]

Im p le m e n t a s e a rc h c o m p o n e n t th a t u s e s u s e D e fe rre d V a lu e to d e fe r th e re n d e rin g o f a filte re d
p ro d u c t lis t w h ile k e e p in g th e s e a rc h in p u t re s p o n s iv e . T h e c o m p o n e n t s h o u ld a c c e p t a lis t o f
p ro d u c ts a n d d is p la y a s e a rc h in p u t a n d filte re d re s u lts . U s e th e d e fe rre d v a lu e to e n s u re th a t
ty p in g in th e s e a rc h b o x d o e s n o t b lo c k u s e r in te ra c tio n , e v e n w h e n th e re s u lts lis t is la rg e o r
e x p e n s iv e to re n d e r. J u s tify y o u r c h o ic e o f u s e D e fe rre d V a lu e o v e r a lte rn a tiv e s lik e

[Image: X550]
Implement a search component that uses useDe
product list while keeping the search input respo
products and display a search input and filtered
typing in the search box does not block user inte
expensive to render. Justify your choice of useD
useTransition or manual debouncing.
[Image: X556]

## ### Requ

1. U s e u s e D e fe rre d V a lu e to d e fe r th e filte re d re s u lts a n d e n s u re th e s e a rc h in p u t re m a in s

2. Implement a memoized ProductList sub-comp
results actually change, not on every keystroke.
[Image: X556] [Image: X552]

3 . In a b rie f c o m m e n t, e x p la in w h y u s e D e fe rre d V a lu e w a s c h o s e n o v e r u s e T ra n s itio n fo r th is

3. In a brief comment, explain why useDeferred
use case, and identify one trade-off.
[Image: X556] [Image: X552]

-Endpo` Gi nEt T: /api/p
[Image: X556] [Image: X552]

---

# # # S t a r t e
[Image: X593]
[Image: X589]

` s r c / h o o k s / u s e P r o
[Image: X593]
[Image: X589]

```javascript
import { useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
}

export function useProductSearch(
  products: Product[],
  query: string
) {
  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [products, query]);

  return filtered;
}

` s r c / c o m p o n e n t s / P
[Image: X595]

```javascript
import React, { useState, memo } from 'react';
import { Product, useProductSearch } from '../hooks/useProductSearch';

interface ProductSearchProps {
  products: Product[];
}

const ProductList = memo(({ items }: { items: Product[] }) => {
  return (
    <div className="product-list">
      {items.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
      ))}
    </div>
  );
});

ProductList.displayName = 'ProductList';

export function ProductSearch({ products}: ProductSearchProps) {
  const [query, setQuery] = useState('');

https://assessment-app.pages.dev/assessment/review

---

```javascript
const filtered = useProductSearch(products, query);

return (
  <div className="search-container">
    <input
      type="text"
      placeholder="Search products..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="search-input"
    />
    <div className="results-count">Found: {filtered.length}</div>
    <ProductList items={filtered} />
  </div>
);
}

Y o u r A n s

= ˆ ˛ Ø
[Image: X617]

M o d e l A n
[Image: X617]

```javascript
// === Part A - Coding Solution ===
`src/hooks/useProductSearch.ts`

```javascript
import { useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
}

export function useProductSearch(
  products: Product[],
  query: string
) {
  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [products, query]);

  return filtered;
}

`src/components/ProductSearch.tsx`

```javascript
import React, { useState, memo, useDeferredValue } from 'react';
import { Product, useProductSearch } from '../hooks/useProductSearch';

interface ProductSearchProps {
  products: Product[];
}

https://assessment-app.pages.dev/assessment/review

---

12 PM VIRKSS Assessment Platform

}

const ProductList = memo({{ items }: { items: Product[] }} => {
  return (
    <div className="product-list">
      {items.length === 0 ? (
        <div className="no-results">No products found</div>
      ) : (
        items.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
          </div>
        ))
      )}
    </div>
  );
});

ProductList.displayName = 'ProductList';

export function ProductSearch({ products}: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const filtered = useProductSearch(products, query);

  // useDeferredValue defers the filtered results, allowing the input to stay responsive
  // while the list updates in the background. Unlike useTransition, useDeferredValue does
  // provide a pending state, making it ideal when you only need deferred rendering without
  // explicit loading feedback. Trade-off: we cannot show a loading indicator mid-render.
  const deferredFiltered = useDeferredValue(filtered);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <div className="results-count">Found: {deferredFiltered.length}</div>
      <ProductList items={deferredFiltered} />
    </div>
  );
}

// === Part A - Expected Signal ===
// - Correct use of useDeferredValue to wrap the filtered results, not the query string
// - Memoized ProductList component that prevents unnecessary re-renders via React.memo with proper dependency tracking
// - Clear comment explaining useDeferredValue vs useTransition trade-off (e.g.,
useDeferredValue is simpler for deferred rendering without explicit pending state;
useTransition is better when you need pending feedback)
// - Passing the deferred value to ProductList, ensuring the list updates asynchronously while input remains responsive
// - Proper TypeScript types maintained throughout
// Strong pass: Candidate correctly applies useDeferredValue to the filtered results (not the query), memoizes ProductList with React.memo, and provides a clear architectural justification comment. Input remains responsive, and the deferred rendering is properly integrated. Code is syntactically valid and handles edge cases (empty results, large lists).

https://assessment-app.pages.dev/assessment/review

---

AI Feed
[Image: X681]
[Image: X679]

No code submitted and no fo
[Image: X681]
[Image: X679]