export interface AuthPayload {
    RecaptchaToken: {
        Action: 'login';
        Token: string;
    };
    UserName: string;
    Email: string;
    CellPhone: string;
    UserDetails: {
        FirstName: string;
        LastName: string;
        DateOfBirth: string;
        CardNumber: string;
        LastFourDigitsSsn: string;
    };
    IsEmail: boolean;
    IsMobile: boolean;
    SelectedLanguage: string;
}
