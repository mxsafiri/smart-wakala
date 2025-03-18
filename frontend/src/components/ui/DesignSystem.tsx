import React from 'react';

const DesignSystem: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-gradient-primary mb-8">Smart Wakala Design System</h1>
      
      <section className="mb-12">
        <h2 className="section-title">Typography</h2>
        <div className="card mb-6">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <p className="mb-4">Regular paragraph text with <a href="#">link styling</a> included.</p>
          <p className="financial-figure text-2xl">TSh 1,250,000</p>
        </div>
        
        <div className="card mb-6">
          <h3 className="card-title">Text Styles</h3>
          <p className="text-gradient-primary text-2xl font-semibold mb-2">Primary Gradient Text</p>
          <p className="text-gradient-secondary text-2xl font-semibold mb-2">Secondary Gradient Text</p>
          <p className="text-gradient-accent text-2xl font-semibold mb-2">Accent Gradient Text</p>
          <p className="text-shadow-md text-2xl font-semibold">Text with Shadow</p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="card-title">Primary Colors</h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={weight} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-md bg-primary-${weight}`} 
                    style={{ backgroundColor: `var(--tw-color-primary-${weight})` }}
                  ></div>
                  <span className="text-xs mt-1">{weight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Secondary Colors</h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={weight} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-md bg-secondary-${weight}`}
                    style={{ backgroundColor: `var(--tw-color-secondary-${weight})` }}
                  ></div>
                  <span className="text-xs mt-1">{weight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Accent Colors</h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={weight} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-md bg-accent-${weight}`}
                    style={{ backgroundColor: `var(--tw-color-accent-${weight})` }}
                  ></div>
                  <span className="text-xs mt-1">{weight}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Semantic Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-success-500"></div>
                <span className="text-xs mt-1">Success</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-warning-500"></div>
                <span className="text-xs mt-1">Warning</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-danger-500"></div>
                <span className="text-xs mt-1">Danger</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-gray-500"></div>
                <span className="text-xs mt-1">Gray</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Buttons</h2>
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="card-title">Button Variants</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-danger">Danger</button>
                <button className="btn btn-outline">Outline</button>
                <button className="btn btn-ghost">Ghost</button>
              </div>
              
              <h3 className="card-title">Button Sizes</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="btn btn-primary btn-sm">Small</button>
                <button className="btn btn-primary">Default</button>
                <button className="btn btn-primary btn-lg">Large</button>
              </div>
            </div>
            
            <div>
              <h3 className="card-title">Buttons with Icons</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <button className="btn btn-primary">
                  <span className="mr-1">✓</span> Success
                </button>
                <button className="btn btn-secondary">
                  <span className="mr-1">$</span> Payment
                </button>
                <button className="btn btn-accent">
                  Continue <span className="ml-1">→</span>
                </button>
                <button className="btn btn-outline">
                  <span className="mr-1">ℹ</span> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="card-title">Basic Card</h3>
            <p>This is a standard card with default styling.</p>
          </div>
          
          <div className="card card-hover">
            <h3 className="card-title">Hover Card</h3>
            <p>This card has a hover effect. Try hovering over it.</p>
          </div>
          
          <div className="card card-active">
            <h3 className="card-title">Active Card</h3>
            <p>This card has an active state with a colored border.</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Form Elements</h2>
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Default Input</label>
              <input type="text" className="input mb-4" placeholder="Enter your name" />
              
              <label className="form-label">Success Input</label>
              <input type="text" className="input input-success mb-4" value="Correct value" />
              
              <label className="form-label">Error Input</label>
              <input type="text" className="input input-error" value="Incorrect value" />
            </div>
            
            <div>
              <label className="form-label">Select Input</label>
              <select className="input mb-4">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
              
              <label className="form-label">Textarea</label>
              <textarea className="input h-32" placeholder="Enter your message"></textarea>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Badges & Status Indicators</h2>
        <div className="card mb-6">
          <h3 className="card-title">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-secondary">Secondary</span>
            <span className="badge badge-accent">Accent</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-danger">Danger</span>
            <span className="badge badge-gray">Gray</span>
          </div>
        </div>
        
        <div className="card mb-6">
          <h3 className="card-title">Status Dots</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="status-dot status-dot-success"></span>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-dot-warning"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-dot-danger"></span>
              <span>Failed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-dot-neutral"></span>
              <span>Inactive</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Financial Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">Balance Indicators:</p>
              <p className="financial-status-positive mb-2">+TSh 250,000 <span className="text-sm">(Deposit)</span></p>
              <p className="financial-status-negative mb-2">-TSh 75,000 <span className="text-sm">(Withdrawal)</span></p>
              <p className="financial-status-neutral mb-2">TSh 1,250,000 <span className="text-sm">(Balance)</span></p>
              <p className="financial-status-warning">TSh 50,000 <span className="text-sm">(Due Soon)</span></p>
            </div>
            
            <div>
              <p className="mb-2">Progress Indicators:</p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Repayment Progress</span>
                  <span className="text-sm">75%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar progress-bar-primary" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Credit Score</span>
                  <span className="text-sm">85%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar progress-bar-success" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overdraft Usage</span>
                  <span className="text-sm">60%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar progress-bar-warning" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Dividers</h2>
        <div className="card">
          <p>Content above the divider</p>
          <div className="divider"></div>
          <p>Content below the divider</p>
          
          <div className="flex items-center mt-6">
            <div>Left content</div>
            <div className="divider-vertical h-12"></div>
            <div>Right content</div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="section-title">Financial Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="card-title">Float Balance</h3>
                <p className="financial-figure text-2xl">TSh 1,250,000</p>
              </div>
              <div className="text-primary-500 text-2xl">
                $
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Last updated: Today, 10:45 AM</span>
            </div>
          </div>
          
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="card-title">Available Overdraft</h3>
                <p className="financial-figure text-2xl">TSh 500,000</p>
              </div>
              <div className="text-secondary-500 text-2xl">
                💳
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Credit Score: Excellent</span>
              <span className="status-dot status-dot-success self-center"></span>
            </div>
          </div>
          
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="card-title">Performance Score</h3>
                <p className="financial-figure text-2xl">85/100</p>
              </div>
              <div className="text-accent-500 text-2xl">
                📈
              </div>
            </div>
            <div className="progress-container mt-2">
              <div className="progress-bar progress-bar-success" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
