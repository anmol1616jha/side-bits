# Launch checklist

Verified in this repository: lint, strict types, formatting, unit and component tests, registry validation, production build, automated accessibility checks (axe-core, both themes), keyboard focus visibility, internal links, responsive layout at 360/768/1280 px, and a dependency audit.

Still needs a person:

- [ ] Check domain, social handles and trademark availability for the name before using it publicly.
- [ ] Set `SITE_URL` in the hosting environment and confirm the sitemap and social previews use it.
- [ ] Manually test with at least one screen reader (e.g. VoiceOver or NVDA) on the homepage, Explore and each project.
- [ ] Add CI that runs `pnpm install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `validate:projects`, `test` and `build`.
- [ ] After the first deploy, check the security headers and a social preview with the platform's validators.
