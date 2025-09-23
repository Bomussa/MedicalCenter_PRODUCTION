export const isValidMilitary = (id: string) => /^(M|m)?[0-9]{2,12}$/.test(id);
export const isValidPersonal = (id: string) => /^(P|p)?[0-9]{8,15}$/.test(id);