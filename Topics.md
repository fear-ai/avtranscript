# Transcript Platform - Open Topics & Areas for Investigation

## **Purpose**
This document organizes open issues and areas for follow-up identified in the project. It focuses on organizing information by topic or technology, presenting what is known and what remains open for investigation. The goal is to solicit opinions and gather feedback rather than rushing to solutions or offering detailed plans.

---

## **React & Next.js Architecture**

### **onClick Handler Issues**
**What We Know:**
- `onClick` handlers not appearing in HTML output during server-side rendering
- Type cards show `cursor-pointer` but no `onClick` attributes in HTML
- React components not fully hydrated on client side
- Silent failures without JavaScript errors

**What We've Tried:**
- Added `ComplexityProvider` to `_app.tsx` (FIXED)
- Used `useCallback` for click handlers
- Converted `div` to `button` elements

**What Remains Open:**
- Why `onClick` handlers still not appearing in HTML
- Alternative event handling patterns (onMouseDown, etc.)
- Next.js SSR hydration best practices for interactive components

**Questions for Investigation:**
- Is this a React hydration issue or Next.js SSR limitation?
- Are there specific patterns for handling interactive elements in Next.js?
- Should we consider client-only components for interactive elements?

### **Provider Context Architecture**
**What We Know:**
- `ComplexityProvider` was missing from `_app.tsx`
- Context dependencies require proper provider wrapping
- Server-side rendering can strip client-side event handlers

**What Remains Open:**
- Optimal provider structure for the application
- Context performance implications
- Provider composition patterns

---

## **User Experience & Interface Design**

### **Home vs Find Page Similarity**
**What We Know:**
- Home and Find pages have very similar above-the-fold content
- Both use similar user type cards and hero sections
- Potential SEO implications of similar content

**What Remains Open:**
- Whether to create shared components or differentiate pages
- Balance between user experience consistency and page differentiation
- SEO impact of similar content across pages

**Options Identified:**
1. Shared Component: Create reusable component for common content
2. Redesign: Completely differentiate the two pages
3. Hybrid: Keep some shared elements, differentiate others

### **User Type Selection Interface**
**What We Know:**
- Currently implemented as clickable cards with visual selection state
- Duplicate user type selection on Home and Find pages
- Integrated with `ComplexityProvider` context

**What Remains Open:**
- Whether to convert to radio button interface
- Optimal interaction pattern for mobile vs desktop
- Accessibility considerations for different interface types

### **Complexity Control & Disclosure**
**What We Know:**
- Current complexity system has 3 levels (low, mid, high)
- Users can manually adjust complexity with +/- controls

**What Remains Open:**
- Whether to implement "Show More/Less" toggle instead of complexity levels
- Alternative approaches like "Too Complicated/Generic" controls
- How to balance simplicity with detailed information disclosure
- User preference for complexity control mechanisms

**Questions for Investigation:**
- Would "Show More/Less" be more intuitive than complexity levels?
- How should we handle progressive disclosure of information?
- What's the optimal balance between simplicity and detail?

### **User Identity & Segmentation**
**What We Know:**
- Current system uses "Amateur" vs "Professional" vs "Agency" labels
- Users must identify with one of these categories

**What Remains Open:**
- Whether forcing users to identify as specific types creates friction
- Alternative approaches to user segmentation
- How to handle users who don't fit cleanly into defined categories
- Impact on user experience and conversion rates

**Questions for Investigation:**
- Do users resist being categorized as "Amateur" vs "Beginner"?
- Should we use more neutral or descriptive labels?
- How can we make user type selection feel natural and helpful?

### **User Session Persistence**
**What We Know:**
- Users currently lose their selections when navigating away and returning
- No persistent storage of user preferences or last viewed state

**What Remains Open:**
- How to implement session tracking to return users to last state
- What user preferences should be persisted across sessions
- Storage mechanism (localStorage, cookies, server-side sessions)
- Privacy implications of session tracking

**Questions for Investigation:**
- What user state should be preserved across sessions?
- How long should session data be retained?
- Should session persistence be opt-in or opt-out?

---

## **Data Management & Quality**

### **CSV Data Issues**
**What We Know:**
- CSV files may have data inconsistencies or formatting issues
- Affects data pipeline reliability and vendor information accuracy
- High priority - affects core data functionality

**What Remains Open:**
- Specific nature and scope of data quality issues
- Whether issues are in source data or processing pipeline
- Data validation and quality monitoring requirements

**Questions for Investigation:**
- What specific inconsistencies exist in the CSV files?
- Are there data format standards we should enforce?
- How should we implement automated data quality checks?

### **Data Pipeline Architecture**
**What We Know:**
- CSV → JSON → TypeScript conversion with smart caching
- Timestamp + hash + size checking implemented
- Automatic dependency management (vendors → affiliates → compile)

**What Remains Open:**
- Update frequency for vendor data
- Integration with vendor APIs for real-time updates
- Automated data quality monitoring

>Reconsider using CSV and either switch to JSON or convert to JSON from Yaml, and store per-vendor data in individual files; revisit Schema research

>Consider storing and compiling into code large extracts of data, like HTML or encoded images, and how JSON or Yaml formats would behave.
---

## **Technology Stack Decisions**

### **Library vs Local Implementation**
**Areas Requiring Evaluation:**
- **Testing**: Jest, React Testing Library, Playwright vs. custom test framework
- **Validation**: Joi, Yup, Zod vs. custom validation logic
- **Error Handling**: Custom error codes vs. established error handling libraries
- **Logging**: Winston, Pino, Bunyan vs. custom logging implementation

**What We Know:**
- Custom implementations exist for error handling and logging
- Need to evaluate maintenance overhead vs. feature richness

**What Remains Open:**
- Team expertise and maintenance capacity assessment
- Long-term maintenance and support requirements
- Integration complexity with existing codebase

**Decision Factors to Consider:**
- Development timeline and resource constraints
- Performance requirements vs. functionality needs
- Dependency management preferences

---

## **Content & Page Architecture**

### **New Page Requirements**
**What We Know:**
- Need dedicated `/learn` page to replace `#learn` anchor
- Need dedicated `/about` page for company information
- Need contact and support functionality
- Need individual vendor pages (`/vendor/[slug]`)

**What Remains Open:**
- Content structure and organization for each page
- Navigation integration and user flow
- SEO optimization requirements
- Content management approach

### **Vendor Page URL Structure**
**What We Know:**
- Need individual pages for each vendor (`/vendor/[slug]`)
- Current vendor data includes names and domains

**What Remains Open:**
- How to generate URL slugs from vendor names or domains
- Handling special characters and international character sets
- URL slug uniqueness and collision resolution
- SEO optimization for vendor page URLs

**Questions for Investigation:**
- Should we use vendor names, domains, or a combination for slugs?
- How do we handle vendors with similar names or domains?
- What's the optimal URL structure for SEO and user experience?
- How should we handle non-Latin character sets in URLs?

### **Footer Simplification**
**What We Know:**
- Current footer has Quick Links and Legal sections
- Target is simplified footer with essential navigation only

**What Remains Open:**
- What constitutes "essential navigation"
- Impact of removing sections on user experience
- Alternative approaches to providing removed information

---

## **Mobile & Responsive Design**

### **Mobile Testing Requirements**
**What We Know:**
- Development testing primarily on desktop/laptop
- Need to verify responsive design and touch interactions
- Focus areas: type cards, vendor cards, search functionality

**What Remains Open:**
- Mobile device testing strategy
- Touch interaction optimization requirements
- Mobile-specific user experience considerations

**Questions for Investigation:**
- What mobile devices and screen sizes should we prioritize?
- Are there mobile-specific features we should implement?
- How should mobile experience differ from desktop?

---

## **Search & Discovery Functionality**

### **Search Box Redesign**
**What We Know:**
- Current search is basic input with limited filtering
- Target is advanced search with multiple criteria, real-time results

**What Remains Open:**
- Specific search criteria and filtering options
- Real-time search implementation approach
- Search result presentation and organization
- Integration with vendor data and filtering system

**Questions for Investigation:**
- What search criteria are most important to users?
- How should search results be ranked and filtered?
- What level of real-time functionality is needed?

---

## **Documentation & Project Management**

### **Documentation Management Challenges**
**What We Know:**
- Documentation grows exponentially, hard to maintain
- Difficult to track what's current vs. outdated
- Implementation gaps between docs and code
- Time spent updating docs instead of building features

**Root Causes Identified:**
- Monolithic approach to documentation
- Documentation and implementation drift apart
- Focus on timestamps rather than content relevance
- Too many status categories and progress indicators

**What Remains Open:**
- Optimal documentation structure and organization
- Documentation update workflow and processes
- Tools and systems for maintaining documentation

### **Documentation Update Rules**
**Rules Identified:**
- Content over dates
- Concise updates (one sentence per change)
- Implementation first
- Status simplification (3 levels: TODO, IN PROGRESS, DONE)
- Living documentation
- Single source of truth
- No historical commentary
- Actionable content only

**What Remains Open:**
- How to enforce these rules
- Tools and processes to support rule compliance
- Metrics for measuring documentation effectiveness

---

## **Market Strategy & User Segmentation**

### **Complexity Implementation Integration**
**What We Know:**
- Market segments and customer types must align with complexity implementation
- User type ↔ complexity mapping defined
- Progressive enhancement approach identified

**What Remains Open:**
- How complexity levels enhance user type features
- Consistent behavior across user types
- Fallback behavior when content doesn't support requested complexity

**Questions for Investigation:**
- How should complexity levels interact with user type features?
- What happens when a user requests complexity level not supported by content?
- How do we maintain consistency across different user types?

### **Market Segment Strategy**
**What We Know:**
- Platform evolved from focused target to broader user base
- Multiple approaches identified (unified, segment-specific, progressive, hybrid)
- Option 1 (unified experience with smart segmentation) recommended

**What Remains Open:**
- Primary vs. secondary segment identification
- Feature overlap analysis across segments
- Development priority strategy
- User experience quality maintenance approach

---

## **Questions for Feedback & Investigation**

### **Technical Architecture**
1. How should we handle the onClick handler issues in Next.js?
2. What's the optimal provider structure for our application?
3. Should we use external libraries or maintain custom implementations?

### **User Experience**
1. How should we differentiate Home and Find pages?
2. What's the best interface for user type selection?
3. How should mobile experience differ from desktop?
4. Should we use "Show More/Less" instead of complexity levels?
5. Do users resist being categorized as specific user types?
6. What user state should be preserved across sessions?

### **Data & Content**
1. What's the priority for addressing CSV data quality issues?
2. How should we structure the new pages (learn, about, contact)?
3. What search functionality is most important to users?
4. How should we generate vendor page URL slugs?
5. What's the optimal balance between simplicity and detail in content disclosure?

### **Project Management**
1. How should we structure documentation to avoid maintenance overhead?
2. What tools and processes would help maintain documentation quality?
3. How should we prioritize the identified development tasks?

---

## **Next Steps**
- Investigate onClick handler issues in Next.js
- Assess CSV data quality issues
- Review library vs. custom implementation options

### **Short Term**
- Mobile testing strategy development
- Search functionality requirements gathering
- Page architecture planning
- User session persistence implementation planning
- Vendor page URL slug strategy development

### **Medium Term**
- Documentation structure optimization
- Market segment strategy validation
- Technology stack evaluation completion
- Complexity control interface redesign evaluation
- User type labeling and segmentation optimization

