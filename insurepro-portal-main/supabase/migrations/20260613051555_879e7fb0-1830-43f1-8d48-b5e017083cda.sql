
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_owns_company(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

INSERT INTO public.insurance_plans (name, tier, monthly_premium, coverage_amount, hospital_network, benefits, waiting_period_months, maternity_coverage) VALUES
('Classic Care', 'classic', 800, 200000, '2,500+ network hospitals', ARRAY['Cashless treatment','Pre & post hospitalization','Day-care procedures'], 3, false),
('Bronze Plus', 'bronze', 1500, 500000, '4,500+ network hospitals', ARRAY['Cashless treatment','Pre & post hospitalization','Day-care procedures','Annual health checkup','Ambulance cover'], 1, false),
('Premium Shield', 'premium', 2800, 1000000, '7,500+ network hospitals', ARRAY['Cashless treatment','Worldwide coverage','Maternity benefits','Newborn cover','Mental health support','No room rent cap','Critical illness'], 0, true);
