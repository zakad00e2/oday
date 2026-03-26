const fs = require('fs');
const file = 'app/[lang]/checkout/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add agreedToPolicies state
if (!content.includes('agreedToPolicies')) {
    content = content.replace(
        'const [errors, setErrors] = useState<Record<string, string>>({});',
        'const [errors, setErrors] = useState<Record<string, string>>({});\n    const [agreedToPolicies, setAgreedToPolicies] = useState(false);'
    );
}

// 2. Add t.legal and t.errors.agreement
if (!content.includes('legal: {')) {
    content = content.replace(
        'summary: {',
        'legal: {\n            agreementLabel: isAr ? "ﬁ—√  Ê√Ê«›ﬁ ⁄·Ï «·‘—Êÿ Ê«·√Õﬂ«„ Ê”Ì«”… «·«” —Ã«⁄" : "I have read and agree to the Terms & Conditions and Refund Policy",\n            termsLabel: isAr ? "«·‘—Êÿ Ê«·√Õﬂ«„" : "Terms & Conditions",\n            refundLabel: isAr ? "”Ì«”… «·«” —Ã«⁄" : "Refund Policy",\n            agreementError: isAr ? "ÌÃ» «·„Ê«›ﬁ… ⁄·Ï «·‘—Êÿ Ê«·√Õﬂ«„ ··«” „—«—" : "You must agree to the terms to continue",\n        },\n        summary: {'
    );
}

// 3. Add to validate()
if (!content.includes('errs.agreement = t.legal.agreementError')) {
    content = content.replace(
        'if (!phone.trim()) errs.phone = t.errors.phone;',
        'if (!phone.trim()) errs.phone = t.errors.phone;\n        if (!agreedToPolicies) errs.agreement = t.legal.agreementError;'
    );
}

// 4. Add the JSX block before the submit button
const buttonPattern = '<button\\n                            type="submit"';
if (!content.includes('agreedToPolicies}')) {
    const newJSX = 
                            <div className="mt-8 mb-6 rounded-2xl border px-5 py-5 transition-colors border-[#e2e8f0] bg-[#f8fafc]">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div className="pt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={agreedToPolicies}
                                            onChange={(e) => {
                                                setAgreedToPolicies(e.target.checked);
                                                setErrors((current) => {
                                                    if (!current.agreement) return current;
                                                    const next = { ...current };
                                                    delete next.agreement;
                                                    return next;
                                                });
                                            }}
                                            className="h-5 w-5 rounded border-[#cbd5e1] text-[#0EA5E9] focus:ring-[#0EA5E9] transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-sm font-medium leading-[1.7] text-[#334155]">
                                            {t.legal.agreementLabel}
                                        </span>
                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                            <Link href={\/\/terms\} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0EA5E9] hover:text-[#0284c7] hover:underline flex items-center gap-1.5">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                {t.legal.termsLabel}
                                            </Link>
                                            <span className="text-[#cbd5e1]">ï</span>
                                            <Link href={\/\/refund-policy\} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0EA5E9] hover:text-[#0284c7] hover:underline flex items-center gap-1.5">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                {t.legal.refundLabel}
                                            </Link>
                                        </div>
                                        {errors.agreement && (
                                            <p className="mt-3 text-sm font-semibold text-red-600 flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                                {errors.agreement}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <button
                                type="submit";
    
    content = content.replace(buttonPattern, newJSX);
}

fs.writeFileSync(file, content);
console.log('Successfully injected terms section');
