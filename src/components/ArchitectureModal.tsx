import React, { useState } from 'react';
import {
  X,
  Layers,
  ShieldCheck,
  Database,
  Terminal,
  Code2,
  CheckCircle,
  FileText
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'security' | 'database'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                TaskFlow - Spring Boot Architecture & Specifications
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Layered design, Spring Security 6, Spring Data JPA, and REST endpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Layered Architecture
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            REST API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Spring Security & RBAC
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            JPA Entities & Schema
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                TaskFlow follows the standard Spring Boot layered enterprise pattern, maintaining strict separation of concerns between presentation, business logic, persistence, and data models:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Web MVC & REST Controllers</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    <code className="text-sky-600 dark:text-sky-400 font-mono">TaskWebController</code>, <code className="text-sky-600 dark:text-sky-400 font-mono">ProjectWebController</code>, <code className="text-sky-600 dark:text-sky-400 font-mono">TaskRestController</code> handling request validation, routing, and HTTP responses.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Service Layer (Business Logic)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    <code className="text-sky-600 dark:text-sky-400 font-mono">TaskServiceImpl</code>, <code className="text-sky-600 dark:text-sky-400 font-mono">ProjectServiceImpl</code>, <code className="text-sky-600 dark:text-sky-400 font-mono">ActivityLogServiceImpl</code> with transactional guarantees and role authorization rules.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Spring Data JPA Repositories</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Interfaces extending <code className="text-sky-600 dark:text-sky-400 font-mono">JpaRepository&lt;T, ID&gt;</code> with custom JPQL queries for filtered search, Kanban columns, and activity log streams.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Security & Error Handling</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Spring Security 6 with BCrypt, CustomUserDetails, GlobalExceptionHandler, custom 403, 404, 500 error views, and JUnit 5 test suites.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/60 flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-sky-900 dark:text-sky-300 leading-relaxed">
                  <strong className="block font-bold mb-0.5">Automated Test Coverage:</strong>
                  Unit and integration test suites are written using JUnit 5, Mockito, and Spring MockMvc in <code className="font-mono">src/test/java/com/taskflow/</code> verifying task lifecycle, role authorization, and validation error handling.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REST API */}
          {activeTab === 'api' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fully functional RESTful endpoints provided by <code className="text-sky-600 dark:text-sky-400 font-mono">@RestController</code> classes:
              </p>
              
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 rounded">GET</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/tasks</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Query tasks with search, priority, status filters</span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded">POST</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/tasks</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Create new task with JSON request body & validation</span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded">PATCH</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/tasks/&#123;id&#125;/status</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Kanban drag & drop quick status update</span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded">POST</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/tasks/&#123;id&#125;/comments</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Add discussion comment to task</span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 rounded">GET</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/dashboard/stats</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Retrieve aggregated task and project KPIs</span>
                </div>

                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 rounded">DELETE</span>
                    <code className="font-mono text-slate-800 dark:text-slate-200">/api/tasks/&#123;id&#125;</code>
                  </div>
                  <span className="text-[11px] text-slate-400">Delete task (restricted to creator or admin)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</h4>
                <div className="space-y-1 text-[11px]">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">ROLE_ADMIN:</strong> Unrestricted access across all workspaces, can delete any project, view all tasks, and manage roles.
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">ROLE_USER:</strong> Standard collaborator. Can create projects, add members, create personal and project tasks, drag Kanban columns, and comment.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Password Hashing & Session Hardening</h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <li>Passwords hashed with <code className="font-mono text-sky-600 dark:text-sky-400">BCryptPasswordEncoder(10)</code></li>
                  <li>Secure HTTP-only session cookies with custom login form and remember-me support</li>
                  <li>Cross-Site Request Forgery (CSRF) tokens attached to HTML forms and API headers</li>
                  <li>Pre-seeded test credentials available for immediate QA demo</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Normalized relational database schema managed via Spring Data JPA and Hibernate ORM:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">users</span>
                  <span className="text-slate-400">id, username, email, password, full_name, avatar_color, bio</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">roles</span>
                  <span className="text-slate-400">id, name (ROLE_USER, ROLE_ADMIN)</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">projects</span>
                  <span className="text-slate-400">id, name, description, color, owner_id, created_at</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">tasks</span>
                  <span className="text-slate-400">id, title, description, priority, status, due_date, category, project_id, assignee_id</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">task_comments</span>
                  <span className="text-slate-400">id, task_id, author_id, content, created_at</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">activity_logs</span>
                  <span className="text-slate-400">id, action, description, entity_type, entity_id, user_id, created_at</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">TaskFlow • Spring Boot 3.2.3 • Java 17</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
