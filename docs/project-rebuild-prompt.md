You are an expert product designer, frontend architect, and full-stack engineer. Build a polished multi-page web application based on the project described below. Do not make it a generic template. Treat this as a real student-facing product with production-minded UX, responsive behavior, clean architecture, and clear information hierarchy.

Project name: Resource Library

Core concept:
Build a student resource-sharing platform where learners can browse academic materials, preview documents, download files after authentication, and upload their own study resources to help other students. The platform should feel trustworthy, organized, warm, and academically useful. It should look like a modern education product rather than a corporate dashboard.

High-level product idea:
This platform is a community-powered academic library for students. Users can explore documents such as textbooks, lecture notes, exam prep packs, summaries, and study guides. The experience starts with a strong marketing-style landing page, then expands into a resource discovery experience, category-specific browsing, authentication, protected preview/download access, and a contributor upload flow.

Important instruction:
Generate diagrams where helpful. Include architecture diagrams, user flow diagrams, page relationship diagrams, state/logic diagrams, and storage/data flow diagrams anywhere they help explain the system better. If you are outputting documentation, include Mermaid diagrams where appropriate.

Primary goals:
1. Make browsing easy and visually inviting.
2. Encourage students to sign up when they want deeper access.
3. Protect preview and download actions behind authentication.
4. Let signed-in users upload useful academic files.
5. Organize resources into clear categories.
6. Create enough reusable sections and subpages to support a large multi-page project.
7. Keep the UX strong on mobile and desktop.

Technology direction:
- Frontend: React + TypeScript
- Build tool: Vite
- Styling: Tailwind CSS
- UI primitives: shadcn-style component patterns
- Routing: React Router
- Notifications: toast system similar to Sonner
- Backend services: Supabase
- Auth: Supabase email/password auth plus Google OAuth
- File storage: Supabase Storage

Visual direction:
- Warm, academic, student-friendly brand
- A refined green and soft gold palette
- Soft card surfaces, subtle gradients, and layered backgrounds
- Large headings, clear typography, and strong spacing rhythm
- Occasional glassmorphism on auth screens
- Educational but modern, not childish
- Responsive sticky header
- Mobile bottom navigation for major routes
- Background details like spotlight glows and faint grid overlays

Brand personality:
- Helpful
- Trustworthy
- Organized
- Encouraging
- Community-driven
- Built for students by students

Use a design language similar to:
- modern learning platforms
- curated digital libraries
- student productivity tools
- editorial landing pages mixed with lightweight SaaS clarity

Main route structure:
- `/` landing page
- `/resources` all resources page
- `/resources/:categorySlug` category details page
- `/resources/preview?doc=...` protected document preview page
- `/upload` upload page
- `/login` login page
- `/signup` signup page
- `/forgot-password` forgot password page
- `/reset-password` reset password page

Shared app shell:
Create a shared layout with:
- top navbar on desktop
- sticky header with branding
- nav links for Home, Resources, Upload
- login button for guests
- authenticated user greeting/menu for signed-in users
- logout action
- mobile bottom navigation with 4 key actions
- footer with brand, quick links, and contact email

Landing page requirements:
Build a rich landing page composed of multiple clear sections. This page should feel like a polished homepage and also seed deeper navigation into the rest of the product.

Landing page sections:
1. Hero banner
- Large background image of students studying
- Gradient overlay for readability
- Label such as “Student Resource Hub”
- Headline communicating that everything students need lives in one library
- Supporting text about textbooks, lecture notes, past questions, and PDF sharing
- CTA buttons for browsing resources and uploading a PDF
- Small chips/tags like course materials and PDF uploads

2. How it works section
- Explain the main product flow in four simple steps
- Browse documents
- Create account / login
- Download and study
- Upload to help others

3. Library highlights section
- Show dynamic counts or stats
- Total files
- Contributors
- Active categories
- Design these as strong visual stat cards

4. Trust/value row
- Fast access
- Verified uploads
- Organized by category

5. Quick actions
- Browse resources
- Upload notes
- Login
- Make these card-based shortcuts

6. Categories section
- Show core categories as cards
- Educational
- Literature
- History
- Business & Career
- Each category should have icon, short description, and a route into the category page

7. Featured resources section
- Show a curated list of highlighted resources
- Include search input for filtering featured items
- Each item should show title, author, category, and download CTA
- If unauthenticated, clicking download should redirect to login

8. FAQ section
- Use expandable/collapsible items
- Explain account requirements, upload size guidance, categorization, and visibility of uploads

9. Upload CTA section
- Encourage students to share materials
- Strong call to action that links to upload page

Resources page requirements:
This should be a major browsing hub, not a simple list.

Resources page structure:
- Top title and intro copy
- Tabs or segmented views:
  - Overview
  - Categories
- Search input for title/author/category discovery
- Sort options:
  - most recent
  - title A-Z
- File type filter
- Category pills/filter chips including “All Categories”

Resources overview content:
- Recommended documents carousel
- Categories carousel
- Per-category trending sections
- Reusable horizontal carousels for document cards
- Empty states when a category has no files

Resources categories content:
- All categories grid
- Each category card should show title, description, intro, and a “View More” action

Document card behavior:
- Card should be interactive
- If the file is a PDF and a preview is available, show an inline embedded first-page preview
- Otherwise show a styled placeholder cover
- Display file format badge
- Show document title and author
- Clicking the card should open the protected preview page
- Download button should enforce authentication

Category page requirements:
Each category should have its own content-rich page.

Category page should include:
- breadcrumb back to Documents
- category headline
- intro paragraph
- loading state while documents load
- three content rails/carousels:
  - documents recommended for you
  - documents about that category
  - recently added
- about section explaining the category in depth

The category pages should feel editorial and informative, not empty shells.

Document preview page requirements:
This is a protected experience and should only be available to signed-in users.

Behavior:
- If the user is not authenticated, redirect to login
- If the document query parameter is missing or invalid, redirect to resources
- Load all document metadata and resolve the active document from the query value
- Detect the active category based on where the document belongs
- Build a related documents panel from the same category where possible

Page layout:
- Left panel with document metadata
- Center large preview area
- Right panel with “You might also like”

Preview page content:
- File format
- Document title
- Added by / uploader label
- Category name
- Download button
- Back button
- Embedded iframe preview when available
- Graceful preview-unavailable state

Authentication rules:
- Browsing can be public
- Preview is protected
- Download is protected
- Upload is protected

Upload page requirements:
The upload page should be a key contributor experience.

Upload page hero:
- Intro headline inviting users to contribute to the student collection
- Supportive body copy about helping other learners
- Stylish panel with form and drag/drop area

Upload form:
- File name input
- Category select
- File picker
- Drag and drop support
- Upload button
- Clear disabled states when user is not signed in

Upload validation:
- Only allow supported document types such as PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, and TXT
- Block files above 10MB in-app
- Show helpful toast messages for invalid file types, oversized files, missing fields, or auth issues

Upload behavior:
- Require authenticated user
- Build storage object names using timestamp, category, and encoded title
- Save files under a user-specific folder path
- Refresh the user’s uploaded file list after successful upload

Uploaded files section:
- Show current user uploads below the form
- Include title, category, upload date if available, and download action
- Show empty state if user has not uploaded anything yet
- Show loading state while files are being fetched

Upload benefits section:
- Add a separate supportive section below the hero
- Explain why students should upload
- Emphasize discoverability, community support, and academic collaboration

Authentication pages:
These should feel premium and visually distinct from the rest of the app.

Login page:
- Full-screen image background
- Dark gradient overlay
- Glassmorphism card
- Email and password fields
- Remember me checkbox
- Forgot password link
- Primary sign-in CTA
- Google sign-in CTA
- Link to sign up
- Supporting right-side promotional panel on large screens

Signup page:
- Same visual family as login
- Full name, email, password, confirm password
- Show/hide password toggles
- Terms acceptance checkbox
- Email/password sign-up and Google sign-up
- Handle confirmed-session case by going directly to resources
- Handle email confirmation case by sending user back to login with guidance

Forgot password page:
- Same auth visual system
- Email input
- Send reset link CTA
- Confirmation message after request succeeds

Reset password page:
- Same auth visual system
- New password and confirm password
- Detect whether the user arrived from a valid recovery link
- If recovery parameters are missing, show a clear instructional note
- On success, redirect back to login

Supabase integration requirements:
Implement and describe the system as using Supabase for both auth and storage.

Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or equivalent anon key fallback

Auth capabilities:
- email/password sign in
- email/password sign up
- Google OAuth sign in
- password reset request
- password update
- auth session checks
- auth state listener to keep navbar and protected actions in sync

Storage capabilities:
- one storage bucket for shared resource files
- recursive listing of bucket content
- grouping documents by category
- upload file to a user folder
- download file directly
- generate public URL when needed for preview

Document metadata and data modeling:
Define a resource document model that includes fields like:
- id
- title
- author
- format
- cover tone / placeholder styling
- storage path
- download URL
- uploadedAt
- optional rating/votes if using seeded content

Define a category model that includes:
- slug
- name
- short description
- headline
- intro
- about
- recommended documents
- trending documents
- recently added documents

Core categories:
- Educational
- Literature
- History
- Business & Career

Category logic:
- Prefer encoded category in file naming
- If category cannot be parsed from the file name, infer from path or text heuristics
- Use reasonable fallback classification

Seed content expectations:
Include strong sample content for each category so the project feels complete even before real uploads grow. Use realistic student-oriented resource titles and author names. Make the seeded data helpful enough to fill many sections and pages.

UX behavior details:
- Use toasts for success/error states
- Add loading messages where network actions occur
- Redirect unauthenticated users to login when they attempt protected actions
- Provide clear empty states
- Provide keyboard-accessible interactive cards
- Use responsive layouts throughout
- Keep page anchors or scroll restoration behavior in mind when navigating between sections

Component architecture:
Break the app into reusable components. Use a modular structure such as:
- shared layout and navigation components
- landing-page section components
- upload-page sections
- resource-page sections
- auth components
- reusable UI primitives like buttons, cards, inputs, selects, carousels, toast host

Suggested internal module organization:
- `pages`
- `components/pages/...`
- `components/shared/...`
- `components/ui/...`
- `lib/auth`
- `lib/storage`
- `lib/supabase`
- `data/resources`
- `types`

State and logic expectations:
- Use local state for filters, active tabs, form state, loading flags, and selected files
- Use memoized derived arrays for filtered/sorted resource lists
- Listen to auth state changes for navbar and protected flows
- Handle effect cleanup properly

Styling notes:
- Use Tailwind utility classes heavily
- Define CSS variables for the color system
- Add subtle background radial gradients
- Include reusable utility classes like hero spotlight and hero grid
- Use rounded cards, light borders, and soft shadows
- Maintain a polished academic aesthetic

Accessibility expectations:
- Keyboard support for clickable cards
- Proper button semantics
- Labels for form fields
- Reasonable contrast
- Informative empty and error messaging

Documentation expectations:
Produce substantial documentation because this project should support many pages and be easy to continue later.

Documentation should include:
- project overview
- product goals
- feature list
- route map
- component map
- auth flow explanation
- storage flow explanation
- upload lifecycle
- protected preview/download rules
- category taxonomy
- UI design system notes
- future improvement ideas

Include helpful diagrams such as:
- overall system architecture
- route/page map
- user journey from landing to preview/download
- upload workflow
- auth lifecycle
- document data flow from storage to UI
- component hierarchy for the landing page and resources page

Example diagram topics to generate:
- Mermaid flowchart for unauthenticated vs authenticated document actions
- Mermaid sequence diagram for upload flow
- Mermaid graph for route structure
- Mermaid component diagram for shared layout and page composition

Quality bar:
- The result should feel like a complete product
- Avoid filler pages
- Avoid unfinished placeholder text
- Prefer intentional spacing, strong copy, and realistic data
- Think through page-to-page cohesion
- Make the landing page persuasive
- Make resource browsing usable
- Make auth flows believable
- Make upload behavior clear and trustworthy

If you are generating code:
- produce production-quality React + TypeScript structure
- keep components modular
- use clean prop typing
- separate data, UI, and service logic sensibly
- keep the codebase scalable

If you are generating documentation or a project brief:
- be extremely detailed
- describe each page thoroughly
- include user stories
- include system behavior
- include diagrams
- include future roadmap suggestions
- make it long enough to support building many pages and sections without needing to infer missing details

Future extension ideas to optionally include:
- user profiles
- upload moderation
- favorites/bookmarks
- recent activity
- admin dashboard
- advanced search by course code or level
- comments/reviews on resources
- analytics for popular downloads
- role-based permissions
- faculty and department filters
- recommendation engine

Final instruction:
Create a comprehensive, well-structured output that could directly guide the design and development of this full Resource Library product. Be explicit about page structure, component boundaries, behaviors, data flow, auth requirements, storage requirements, and UX rules. Generate diagrams where they help. Make the output rich, detailed, and long-form so it can support a large project with many pages.
