/* New file – Non-destructive Migrations for Admin v2 – 2025-09-26 */

-- Feature Flags Table
CREATE TABLE IF NOT EXISTS FeatureFlag2 (
    key VARCHAR(255) PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS SystemSettings2 (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinic Queue Table
CREATE TABLE IF NOT EXISTS ClinicQueue2 (
    clinicid INTEGER NOT NULL,
    date DATE NOT NULL,
    currentnumber INTEGER,
    avgdurationsec INTEGER,
    waiting JSONB,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (clinicid, date)
);

-- Visit Timing Table (for stats)
CREATE TABLE IF NOT EXISTS VisitTiming2 (
    id SERIAL PRIMARY KEY,
    clinicid INTEGER NOT NULL,
    visitorid INTEGER NOT NULL,
    examid INTEGER,
    entrytime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exittime TIMESTAMP WITH TIME ZONE,
    waitedsec INTEGER,
    durationsec INTEGER
);

-- Clinic PIN Table
CREATE TABLE IF NOT EXISTS ClinicPin2 (
    id SERIAL PRIMARY KEY,
    clinicid INTEGER NOT NULL,
    validdate DATE NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    redirectclinicid INTEGER,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Archive Table
CREATE TABLE IF NOT EXISTS ReportArchive2 (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    period_from DATE,
    period_to DATE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error Log Table
CREATE TABLE IF NOT EXISTS ErrorLog2 (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255),
    message TEXT NOT NULL,
    stack TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


