# План разработки: Этап 2.2 (Настройка чистого GitHub OAuth)

## Завершенные задачи

- [x] **Шаг 1: Очистка `admin/index.html` от Netlify Identity**
  - Найти и полностью удалить подключение скрипта `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>`.
  - Найти и полностью удалить встроенный JS-скрипт инициализации `netlifyIdentity` (весь блок `<script>...if (window.netlifyIdentity)...</script>` внизу файла).
  - Убедиться, что на странице остался только базовый скрипт самой CMS (`https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js`).

- [x] **Шаг 2: Настройка бэкенда в `admin/config.yml`**
  - Полностью заменить настройки в блоке `backend` на следующие:
    - `name: github`
    - `repo: NekrasovLE/VRKvant`
    - `branch: main`
    - `base_url: https://netlify-cms-github-oauth-provider-flame.vercel.app`
