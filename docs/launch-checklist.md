# Launch checklist

Automated in this repository (`pnpm lint`, `typecheck`, `format:check`, `test`, `validate:projects`, `build`, `audit`): lint, strict types, formatting, unit and component tests, registry validation, the production build and a dependency audit.

Checked once by hand before launch, with no automated test in the repository yet: accessibility scans with axe-core in both themes, keyboard focus visibility, internal links, and responsive layout at 360/768/1280 px. Re-check these after visible changes.

Still needs a person:

- [ ] Check domain, social handles and trademark availability for the name before using it publicly.
- [ ] Set `SITE_URL` in the hosting environment and confirm the sitemap and social previews use it.
- [ ] Manually test with at least one screen reader (e.g. VoiceOver or NVDA) on the homepage, Explore and each project.
- [ ] Add CI that runs `pnpm install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `validate:projects`, `test` and `build`.
- [ ] Consider a browser test suite (e.g. Playwright with axe-core) so the hand-checked items above run automatically.
- [ ] After the first deploy, check the security headers and a social preview with the platform's validators.
