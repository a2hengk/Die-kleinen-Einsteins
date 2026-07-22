$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "Die-kleinen-Einsteins-Praesentation.pptx"

function RgbInt([int]$r, [int]$g, [int]$b) {
    return $r + ($g * 256) + ($b * 65536)
}

function New-CodeImage {
    param(
        [string]$Path,
        [string]$Title,
        [string[]]$Lines
    )

    $width = 1600
    $lineHeight = 30
    $height = [Math]::Max(520, 96 + ($Lines.Count * $lineHeight))
    $bmp = [System.Drawing.Bitmap]::new($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bg = [System.Drawing.Color]::FromArgb(28, 31, 36)
    $header = [System.Drawing.Color]::FromArgb(42, 47, 55)
    $text = [System.Drawing.Color]::FromArgb(232, 236, 239)
    $muted = [System.Drawing.Color]::FromArgb(140, 151, 163)
    $accent = [System.Drawing.Color]::FromArgb(103, 199, 217)

    $g.Clear($bg)
    $g.FillRectangle([System.Drawing.SolidBrush]::new($header), 0, 0, $width, 62)
    $g.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 95, 86)), 26, 22, 18, 18)
    $g.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 189, 46)), 58, 22, 18, 18)
    $g.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(39, 201, 63)), 90, 22, 18, 18)

    $titleFont = [System.Drawing.Font]::new("Segoe UI", 21, [System.Drawing.FontStyle]::Bold)
    $codeFont = [System.Drawing.Font]::new("Consolas", 21, [System.Drawing.FontStyle]::Regular)
    $lineFont = [System.Drawing.Font]::new("Consolas", 19, [System.Drawing.FontStyle]::Regular)
    $g.DrawString($Title, $titleFont, [System.Drawing.SolidBrush]::new($accent), 136, 16)

    for ($i = 0; $i -lt $Lines.Count; $i++) {
        $y = 86 + ($i * $lineHeight)
        $lineNumber = ($i + 1).ToString().PadLeft(2)
        $g.DrawString($lineNumber, $lineFont, [System.Drawing.SolidBrush]::new($muted), 30, $y)
        $g.DrawString($Lines[$i], $codeFont, [System.Drawing.SolidBrush]::new($text), 92, $y)
    }

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $titleFont.Dispose()
    $codeFont.Dispose()
    $lineFont.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

function New-AppOverviewImage {
    param([string]$Path)

    $width = 1600
    $height = 1000
    $bmp = [System.Drawing.Bitmap]::new($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bg = [System.Drawing.Color]::FromArgb(245, 239, 230)
    $panel = [System.Drawing.Color]::White
    $border = [System.Drawing.Color]::FromArgb(216, 212, 202)
    $primary = [System.Drawing.Color]::FromArgb(31, 122, 140)
    $strong = [System.Drawing.Color]::FromArgb(20, 87, 102)
    $muted = [System.Drawing.Color]::FromArgb(74, 90, 97)

    $g.Clear($bg)

    $shadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(30, 15, 36, 39))
    $g.FillRectangle($shadow, 142, 104, 1316, 724)
    $g.FillRectangle([System.Drawing.SolidBrush]::new($panel), 130, 90, 1310, 720)
    $g.DrawRectangle([System.Drawing.Pen]::new($border, 2), 130, 90, 1310, 720)

    $titleFont = [System.Drawing.Font]::new("Segoe UI", 42, [System.Drawing.FontStyle]::Bold)
    $hFont = [System.Drawing.Font]::new("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
    $textFont = [System.Drawing.Font]::new("Segoe UI", 19, [System.Drawing.FontStyle]::Regular)
    $smallFont = [System.Drawing.Font]::new("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)

    $g.DrawString("Karteikartenuebersicht", $titleFont, [System.Drawing.SolidBrush]::new($strong), 190, 140)

    $cards = @(
        @{ x = 190; y = 250; front = "HTTP Methode"; back = "GET, POST, PATCH, DELETE" },
        @{ x = 570; y = 250; front = "Frontend"; back = "React-Komponenten + CSS-Module" },
        @{ x = 950; y = 250; front = "Datenbank"; back = "Postgres mit Drizzle ORM" }
    )

    foreach ($card in $cards) {
        $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(252, 250, 247)), $card.x, $card.y, 330, 210)
        $g.DrawRectangle([System.Drawing.Pen]::new($border, 2), $card.x, $card.y, 330, 210)
        $g.FillRectangle([System.Drawing.SolidBrush]::new($primary), $card.x, $card.y, 330, 8)
        $g.DrawString("Vorderseite", $smallFont, [System.Drawing.SolidBrush]::new($muted), $card.x + 26, $card.y + 35)
        $g.DrawString($card.front, $hFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(22, 33, 38)), $card.x + 26, $card.y + 66)
        $g.DrawString("Rueckseite", $smallFont, [System.Drawing.SolidBrush]::new($muted), $card.x + 26, $card.y + 123)
        $g.DrawString($card.back, $textFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(22, 33, 38)), [System.Drawing.RectangleF]::new($card.x + 26, $card.y + 152, 278, 56))
    }

    $g.DrawRectangle([System.Drawing.Pen]::new($border, 4), 190, 520, 330, 190)
    $g.DrawString("+", [System.Drawing.Font]::new("Segoe UI", 58, [System.Drawing.FontStyle]::Regular), [System.Drawing.SolidBrush]::new($primary), 330, 555)
    $g.DrawString("Neue Karte", $hFont, [System.Drawing.SolidBrush]::new($muted), 288, 640)

    $g.FillRectangle([System.Drawing.SolidBrush]::new($panel), 420, 875, 760, 76)
    $g.DrawRectangle([System.Drawing.Pen]::new($border, 2), 420, 875, 760, 76)
    $g.FillRectangle([System.Drawing.SolidBrush]::new($primary), 560, 887, 180, 52)
    $g.DrawString("Karteikasten", $smallFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), 590, 902)
    $g.DrawString("Selbstlernen", $smallFont, [System.Drawing.SolidBrush]::new($strong), 780, 902)
    $g.DrawString("Abfragen", $smallFont, [System.Drawing.SolidBrush]::new($strong), 965, 902)

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

function Add-TextBox($slide, [string]$Text, [float]$Left, [float]$Top, [float]$Width, [float]$Height, [int]$Size = 22, [bool]$Bold = $false, [int]$Color = 0) {
    $shape = $slide.Shapes.AddTextbox(1, $Left, $Top, $Width, $Height)
    $shape.TextFrame.TextRange.Text = $Text
    $shape.TextFrame.TextRange.Font.Name = "Aptos"
    $shape.TextFrame.TextRange.Font.Size = $Size
    $shape.TextFrame.TextRange.Font.Bold = if ($Bold) { -1 } else { 0 }
    $shape.TextFrame.TextRange.Font.Color.RGB = $Color
    $shape.TextFrame.WordWrap = -1
    return $shape
}

function Add-Bullets($slide, [string[]]$Items, [float]$Left, [float]$Top, [float]$Width, [float]$Height, [int]$Size = 22) {
    $text = ($Items | ForEach-Object { "- $_" }) -join "`r"
    $shape = Add-TextBox $slide $text $Left $Top $Width $Height $Size $false (RgbInt 22 33 38)
    $shape.TextFrame.TextRange.ParagraphFormat.SpaceAfter = 8
    return $shape
}

function Add-Title($slide, [string]$Title, [string]$Subtitle = "") {
    Add-TextBox $slide $Title 48 32 864 54 31 $true (RgbInt 20 87 102) | Out-Null
    if ($Subtitle) {
        Add-TextBox $slide $Subtitle 50 84 760 34 15 $false (RgbInt 74 90 97) | Out-Null
    }
}

$loginImage = Join-Path $PSScriptRoot "app-login.png"
$overviewImage = Join-Path $PSScriptRoot "app-overview-rendered.png"
$frontendCode = Join-Path $PSScriptRoot "code-frontend-registration.png"
$apiCode = Join-Path $PSScriptRoot "code-api-cards.png"
$dbCode = Join-Path $PSScriptRoot "code-db-schema.png"
$clientCode = Join-Path $PSScriptRoot "code-client-api.png"
$crudCode = Join-Path $PSScriptRoot "code-crud-id.png"

New-AppOverviewImage $overviewImage

New-CodeImage $frontendCode "src/app/anmeldung/page.tsx" @(
    'const DEMO_USER: StoredUser = {',
    '  username: "Test",',
    '  email: "test@test.com",',
    '  password: "1234",',
    '  userId: "user-test-test-com"',
    '};',
    '',
    'const handleRegister = async (): Promise<void> => {',
    '  const emailValue = normalizeEmail(form.email);',
    '  const users = readUsers();',
    '  const emailExists = users.some((user) => normalizeEmail(user.email) === emailValue);',
    '  if (emailExists) setGeneralError("Diese E-Mail-Adresse ist schon registriert.");',
    '  saveUsers([...users, newUser]);',
    '  await saveLogin(newUser);',
    '  router.push("/overview");',
    '};'
)

New-CodeImage $apiCode "src/app/api/cards/route.ts" @(
    'export async function GET() {',
    '  const userId = getCurrentUserId();',
    '  const cards = await getCardsForUser(userId);',
    '  return NextResponse.json(cards);',
    '}',
    '',
    'export async function POST(request: NextRequest) {',
    '  const body = await request.json().catch(() => null);',
    '  const result = createCardSchema.safeParse(body);',
    '  if (!result.success) return validationErrorResponse(result.error);',
    '  const card = await createCard(userId, result.data.front, result.data.back);',
    '  return NextResponse.json(card, { status: 201 });',
    '}'
)

New-CodeImage $crudCode "src/app/api/cards/[id]/route.ts" @(
    'export async function PATCH(request: NextRequest, { params }: RouteParams) {',
    '  const cardId = Number((await params).id);',
    '  const result = updateCardSchema.safeParse(await request.json());',
    '  const card = await updateCard(userId, cardId, result.data);',
    '  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });',
    '  return NextResponse.json(card);',
    '}',
    '',
    'export async function DELETE(_request: NextRequest, { params }: RouteParams) {',
    '  const card = await deleteCard(userId, cardId);',
    '  return NextResponse.json(card);',
    '}'
)

New-CodeImage $dbCode "src/db/schema.ts" @(
    'export const cards = pgTable("cards", {',
    '  id: serial("id").primaryKey(),',
    '  userId: text("user_id").notNull(),',
    '  front: text("front").notNull(),',
    '  back: text("back").notNull(),',
    '  createdAt: timestamp("created_at").defaultNow().notNull(),',
    '  updatedAt: timestamp("updated_at").defaultNow().notNull(),',
    '});',
    '',
    'export const cardProgress = pgTable("card_progress", {',
    '  cardId: integer("card_id").references(() => cards.id, { onDelete: "cascade" }),',
    '  correctCount: integer("correct_count").default(0).notNull(),',
    '  wrongCount: integer("wrong_count").default(0).notNull(),',
    '});'
)

New-CodeImage $clientCode "src/lib/api/cards.ts" @(
    'export function fetchCards(): Promise<Flashcard[]> {',
    '  return fetch("/api/cards").then((res) => handleResponse<Flashcard[]>(res));',
    '}',
    '',
    'export function createCard(front: string, back: string): Promise<Flashcard> {',
    '  return fetch("/api/cards", {',
    '    method: "POST",',
    '    headers: { "content-type": "application/json" },',
    '    body: JSON.stringify({ front, back }),',
    '  }).then((res) => handleResponse<Flashcard>(res));',
    '}'
)

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = -1
$presentation = $ppt.Presentations.Add()
$presentation.PageSetup.SlideWidth = 960
$presentation.PageSetup.SlideHeight = 540
$blank = 12

function New-Slide {
    $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, $blank)
    $slide.Background.Fill.ForeColor.RGB = RgbInt 245 239 230
    return $slide
}

$slide = New-Slide
Add-TextBox $slide "Die kleinen Einsteins" 58 72 760 70 42 $true (RgbInt 20 87 102) | Out-Null
Add-TextBox $slide "Karteikarten-Web-App: Frontend, Backend, Datenbank, Kommunikation und CRUD" 62 150 760 58 22 $false (RgbInt 22 33 38) | Out-Null
Add-Bullets $slide @("Vortragsdauer: 5-10 Minuten", "Demo-Login: Test / test@test.com / 1234", "Stack: Next.js, React, REST-API, Drizzle ORM, PostgreSQL, Docker") 66 248 780 144 23 | Out-Null

$slide = New-Slide
Add-Title $slide "Kurzvorstellung der App" "Einstieg, Registrierung und Weiterleitung in den Karteikasten"
$slide.Shapes.AddPicture($loginImage, 0, -1, 50, 124, 420, 292) | Out-Null
$slide.Shapes.AddPicture($overviewImage, 0, -1, 506, 124, 404, 253) | Out-Null
Add-Bullets $slide @("Startseite ist die Anmeldung ohne Navbar", "Registrierung speichert neue Benutzer lokal", "Nach Login geht es automatisch zum Karteikasten") 510 390 390 96 18 | Out-Null

$slide = New-Slide
Add-Title $slide "Frontend" "Client Components, React-State und CSS-Module"
$slide.Shapes.AddPicture($frontendCode, 0, -1, 48, 122, 520, 338) | Out-Null
Add-Bullets $slide @("Anmeldung nutzt useState fuer Formularwerte und Fehler", "Login/Registrierung werden im Browser gespeichert", "Navbar wird auf der Login-Seite nicht gemountet", "CSS nutzt globale Design-Tokens aus Component.css") 600 132 310 260 19 | Out-Null

$slide = New-Slide
Add-Title $slide "Backend" "REST-Routen im Next.js App Router"
$slide.Shapes.AddPicture($apiCode, 0, -1, 48, 126, 548, 304) | Out-Null
Add-Bullets $slide @("GET /api/cards liest alle Karten des aktuellen Users", "POST /api/cards erstellt eine neue Karte", "Zod validiert Request-Bodies", "Responses werden als JSON zurueckgegeben") 625 142 286 220 19 | Out-Null

$slide = New-Slide
Add-Title $slide "Datenbank" "PostgreSQL mit Drizzle ORM"
$slide.Shapes.AddPicture($dbCode, 0, -1, 48, 120, 555, 342) | Out-Null
Add-Bullets $slide @("Tabelle cards speichert Vorder- und Rueckseite", "user_id trennt Daten pro Benutzer-String", "card_progress speichert richtig/falsch-Zaehler", "Migrationen liegen im drizzle-Ordner") 630 134 285 250 19 | Out-Null

$slide = New-Slide
Add-Title $slide "Kommunikation" "Vom React-Klick bis zur Datenbank"
$slide.Shapes.AddPicture($clientCode, 0, -1, 48, 126, 545, 304) | Out-Null
Add-Bullets $slide @("Frontend ruft fetch('/api/cards') auf", "API-Route validiert und ruft Query-Funktionen auf", "Drizzle erzeugt SQL fuer PostgreSQL", "Antwort fliesst als JSON zurueck in den React-State") 625 134 290 250 19 | Out-Null

$slide = New-Slide
Add-Title $slide "CRUD-Befehle" "Create, Read, Update und Delete im Projekt"
Add-TextBox $slide "Create   POST /api/cards`rRead     GET /api/cards`rUpdate   PATCH /api/cards/:id`rDelete   DELETE /api/cards/:id" 60 130 430 150 23 $true (RgbInt 22 33 38) | Out-Null
$slide.Shapes.AddPicture($crudCode, 0, -1, 510, 120, 398, 292) | Out-Null
Add-TextBox $slide "Alle vier Befehle laufen ueber dieselbe Ressource: cards. Die ID-Route wird fuer einzelne Karten verwendet." 64 338 390 92 19 $false (RgbInt 74 90 97) | Out-Null

$slide = New-Slide
Add-Title $slide "Docker und Start" "App-Container plus Postgres-Container"
Add-Bullets $slide @("docker-compose.yml startet die Next.js-App und PostgreSQL", "DATABASE_URL verbindet App und Datenbank", "npm run db:migrate legt Tabellen an", "localhost:3000 zeigt danach die Anwendung") 70 132 420 220 23 | Out-Null
Add-TextBox $slide "docker compose up --build`rdocker compose exec die-kleinen-einsteins npm run db:migrate" 72 365 540 82 23 $true (RgbInt 20 87 102) | Out-Null
Add-TextBox $slide "Hinweis: Innerhalb von Docker heisst der Datenbank-Host db, lokal heisst er localhost." 588 150 290 160 20 $false (RgbInt 74 90 97) | Out-Null

$slide = New-Slide
Add-Title $slide "Fazit und Demo-Ablauf" "Was in 5-10 Minuten gezeigt werden kann"
Add-Bullets $slide @("1. Anmeldung/Registrierung kurz zeigen", "2. Karte anlegen und im Karteikasten sehen", "3. Karte bearbeiten und loeschen", "4. API- und DB-Code erklaeren", "5. Docker/Migrationen als Betriebsweg nennen") 96 130 760 260 25 | Out-Null
Add-TextBox $slide "Kernaussage: Die App verbindet ein einfaches React-Frontend mit REST-Endpunkten und persistiert Karteikarten ueber Drizzle in PostgreSQL." 100 420 760 70 22 $true (RgbInt 20 87 102) | Out-Null

for ($i = 1; $i -le $presentation.Slides.Count; $i++) {
    $s = $presentation.Slides.Item($i)
    Add-TextBox $s "$i / $($presentation.Slides.Count)" 872 500 60 20 11 $false (RgbInt 74 90 97) | Out-Null
}

$presentation.SaveAs($out)
$presentation.Close()
$ppt.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null

Write-Output $out
