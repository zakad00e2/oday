const fs = require('fs');
const file = 'app/[lang]/checkout/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr =                             <div className={\mt-5 rounded-2xl border px-4 py-4 \\}>
                                <label className="flex items-start gap-3 cursor-pointer">
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
                                        className="mt-1 h-4 w-4 rounded border-[#cbd5e1] text-[#0EA5E9] focus:ring-[#0EA5E9]"
                                    />
                                    <span className="text-sm leading-relaxed text-[#334155]">{t.legal.agreementLabel}</span>
                                </label>

                                <p className="mt-3 text-xs leading-relaxed text-[#64748b]">{t.legal.whatsappNote}</p>
                                {errors.agreement && <p className="mt-3 text-xs font-medium text-red-600">{errors.agreement}</p>}
                            </div>;

const newStr =                             <div className={\mt-5 rounded-2xl border px-5 py-5 transition-colors \\}>
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
                                        <span className="block text-sm font-medium leading-relaxed text-[#334155]">
                                            {t.legal.agreementLabel}
                                        </span>
                                        <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex flex-wrap items-center gap-4 text-sm">
                                            <Link href={\/\/terms\} target="_blank" className="font-semibold text-[#0EA5E9] hover:text-[#0284c7] flex items-center gap-1.5 transition-colors">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                {t.legal.termsLabel}
                                            </Link>
                                            <Link href={\/\/refund-policy\} target="_blank" className="font-semibold text-[#0EA5E9] hover:text-[#0284c7] flex items-center gap-1.5 transition-colors">
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
                            </div>;

const gridDiv =                             <div className="grid gap-3 md:grid-cols-2">
                                <Link
                                    href={\/\/terms\}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-2xl border border-[#dbe4ee] bg-white px-4 py-4 transition-colors hover:border-[#0EA5E9]/40 hover:bg-[#fafdff]"
                                >
                                    <span className="block text-sm font-bold text-[#0f172a]">{t.legal.termsLabel}</span>
                                    <span className="mt-2 block text-sm text-[#0EA5E9]">{t.legal.termsLink}</span>
                                </Link>

                                <Link
                                    href={\/\/refund-policy\}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-2xl border border-[#dbe4ee] bg-white px-4 py-4 transition-colors hover:border-[#0EA5E9]/40 hover:bg-[#fafdff]"
                                >
                                    <span className="block text-sm font-bold text-[#0f172a]">{t.legal.refundLabel}</span>
                                    <span className="mt-2 block text-sm text-[#0EA5E9]">{t.legal.refundLink}</span>
                                </Link>
                            </div>

;

const headersDiv =                             <div className="mb-5">
                                <h3 className="text-base md:text-lg font-bold text-[#0f172a]">{t.legal.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{t.legal.intro}</p>
                            </div>

;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    content = content.replace(gridDiv, '');
    content = content.replace(headersDiv, '');
    fs.writeFileSync(file, content);
    console.log('Done replacement');
} else {
    console.log('Str not found');
}
