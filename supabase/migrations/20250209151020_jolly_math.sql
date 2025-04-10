/*
  # Add Sample School Performance Data for Current Month

  1. Changes
    - Generate realistic daily metrics for all schools
    - Include data for all weekdays in current month
    - Add computed metrics for performance scoring

  2. Data Generated
    - Daily metrics for each school
    - Realistic variations based on day of week
    - Complete set of required metrics
*/

-- Generate daily metrics for each school
WITH RECURSIVE dates AS (
  SELECT generate_series(
    date_trunc('month', CURRENT_DATE)::date,
    CURRENT_DATE + interval '1 month - 1 day',
    '1 day'::interval
  )::date AS date
),
school_base_metrics AS (
  SELECT 
    s.id as school_id,
    s.name,
    CASE 
      WHEN s.name = 'Cybersoft High' THEN 1500
      WHEN s.name = 'Cybersoft Middle' THEN 1000
      WHEN s.name = 'Cybersoft Elementary' THEN 750
      WHEN s.name = 'Primero High' THEN 1200
      WHEN s.name = 'Primero Elementary' THEN 600
    END as enrollment,
    CASE 
      WHEN s.name LIKE '%High%' THEN 0.55
      WHEN s.name LIKE '%Middle%' THEN 0.60
      ELSE 0.65
    END as free_reduced_rate,
    CASE 
      WHEN s.name LIKE '%High%' THEN 0.25
      WHEN s.name LIKE '%Middle%' THEN 0.30
      ELSE 0.35
    END as breakfast_rate,
    CASE 
      WHEN s.name LIKE '%High%' THEN 0.65
      WHEN s.name LIKE '%Middle%' THEN 0.70
      ELSE 0.75
    END as lunch_rate
  FROM schools s
  WHERE s.district_id = 'd7c01812-80ae-4662-8f5e-4ab37a46f3e2'
)
INSERT INTO school_daily_metrics (
  school_id,
  date,
  total_enrollment,
  free_reduced_count,
  breakfast_count,
  lunch_count,
  reimbursement_amount,
  alc_revenue,
  meal_equivalents,
  labor_hours,
  district_id
)
SELECT
  sm.school_id,
  d.date,
  sm.enrollment,
  (sm.enrollment * sm.free_reduced_rate)::int,
  generate_daily_factor(d.date, sm.enrollment * sm.breakfast_rate)::int,
  generate_daily_factor(d.date, sm.enrollment * sm.lunch_rate)::int,
  generate_daily_factor(d.date, 
    CASE 
      WHEN sm.enrollment >= 1000 THEN 5000
      ELSE 3000
    END
  ),
  generate_daily_factor(d.date,
    CASE 
      WHEN sm.enrollment >= 1000 THEN 1200
      ELSE 800
    END
  ),
  generate_daily_factor(d.date,
    CASE 
      WHEN sm.enrollment >= 1000 THEN 1000
      ELSE 600
    END
  )::int,
  CASE 
    WHEN sm.enrollment >= 1000 THEN 60
    ELSE 40
  END,
  'd7c01812-80ae-4662-8f5e-4ab37a46f3e2'
FROM dates d
CROSS JOIN school_base_metrics sm
WHERE EXTRACT(DOW FROM d.date) NOT IN (0, 6)  -- Exclude weekends
ON CONFLICT (school_id, date) DO UPDATE
SET
  total_enrollment = EXCLUDED.total_enrollment,
  free_reduced_count = EXCLUDED.free_reduced_count,
  breakfast_count = EXCLUDED.breakfast_count,
  lunch_count = EXCLUDED.lunch_count,
  reimbursement_amount = EXCLUDED.reimbursement_amount,
  alc_revenue = EXCLUDED.alc_revenue,
  meal_equivalents = EXCLUDED.meal_equivalents,
  labor_hours = EXCLUDED.labor_hours;