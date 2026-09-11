# Test strategy

## Objective

Provide fast feedback on the highest business risks in a small commerce workflow while showing how different test layers complement one another.

## Risk-to-test mapping

| Risk                                  | Primary coverage                     | Why                                                 |
| ------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| Users cannot authenticate             | API and UI tests                     | Separates service behavior from browser integration |
| Product contract changes unexpectedly | API schema test                      | Detects breaking payload changes early              |
| Search produces incorrect results     | Data-driven UI and API tests         | Covers user behavior and service filtering          |
| Out-of-stock items are purchased      | API domain test and UI state test    | Verifies both enforcement and presentation          |
| Checkout fails across browsers        | Playwright Chromium, Firefox, WebKit | Exercises browser-engine differences                |
| Product service is unavailable        | Network-fault test                   | Confirms a recoverable user experience              |
| Keyboard/screen-reader barriers ship  | axe WCAG scan plus semantic locators | Adds automated accessibility feedback               |
| Order API slows under load            | k6 thresholds                        | Defines an explicit latency/error budget            |
| Legacy Selenium estate breaks         | Java Selenium smoke tests            | Demonstrates maintainable WebDriver coverage        |

## Test pyramid

API tests carry most business-rule assertions because they are faster and more diagnostic. A smaller UI suite covers high-value journeys and browser integration. Accessibility, fault injection, and performance tests cover quality attributes that functional tests cannot.

## Reliability controls

- Role, label, and test-ID-free semantic locators where possible
- Auto-waiting assertions instead of fixed sleeps
- Isolated browser contexts
- Locally controlled application and deterministic data
- Traces on first retry and media retained only on failure
- Parallel-safe assertions that do not depend on a specific order ID
- CI artifacts retained for post-failure diagnosis

## Exit criteria

- All smoke tests pass on Chromium, Firefox, and WebKit
- No serious or critical axe violations
- TypeScript type checking and formatting pass
- API schema contract remains valid
- k6 error rate is below 1% and p95 latency is below 300 ms in the local reference test

Performance thresholds are environment-sensitive and should be calibrated using a controlled runner before being treated as a release gate.
