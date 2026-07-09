$books = @(
  # --- ROMANCE ---
  @{ id="pride-and-prejudice";         url="https://www.gutenberg.org/cache/epub/1342/pg1342.txt" },
  @{ id="sense-and-sensibility";       url="https://www.gutenberg.org/cache/epub/161/pg161.txt" },
  @{ id="emma";                        url="https://www.gutenberg.org/cache/epub/158/pg158.txt" },
  @{ id="persuasion";                  url="https://www.gutenberg.org/cache/epub/105/pg105.txt" },
  @{ id="mansfield-park";              url="https://www.gutenberg.org/cache/epub/141/pg141.txt" },
  @{ id="northanger-abbey";            url="https://www.gutenberg.org/cache/epub/121/pg121.txt" },
  @{ id="jane-eyre";                   url="https://www.gutenberg.org/cache/epub/1263/pg1263.txt" },
  @{ id="wuthering-heights";           url="https://www.gutenberg.org/cache/epub/768/pg768.txt" },
  @{ id="tess-of-the-durbervilles";    url="https://www.gutenberg.org/cache/epub/110/pg110.txt" },
  @{ id="far-from-the-madding-crowd";  url="https://www.gutenberg.org/cache/epub/27/pg27.txt" },
  @{ id="the-age-of-innocence";        url="https://www.gutenberg.org/cache/epub/541/pg541.txt" },
  @{ id="the-house-of-mirth";          url="https://www.gutenberg.org/cache/epub/284/pg284.txt" },
  @{ id="lady-chatterleys-lover";      url="https://www.gutenberg.org/cache/epub/63606/pg63606.txt" },
  @{ id="romeo-and-juliet";            url="https://www.gutenberg.org/cache/epub/1112/pg1112.txt" },
  @{ id="the-tenant-of-wildfell-hall"; url="https://www.gutenberg.org/cache/epub/969/pg969.txt" },
  @{ id="anna-karenina";               url="https://www.gutenberg.org/cache/epub/1399/pg1399.txt" },

  # --- ADVENTURE ---
  @{ id="moby-dick";                   url="https://www.gutenberg.org/cache/epub/2701/pg2701.txt" },
  @{ id="adventures-huckleberry-finn"; url="https://www.gutenberg.org/cache/epub/76/pg76.txt" },
  @{ id="adventures-of-tom-sawyer";    url="https://www.gutenberg.org/cache/epub/74/pg74.txt" },
  @{ id="treasure-island";             url="https://www.gutenberg.org/cache/epub/120/pg120.txt" },
  @{ id="kidnapped";                   url="https://www.gutenberg.org/cache/epub/1104/pg1104.txt" },
  @{ id="call-of-wild";                url="https://www.gutenberg.org/cache/epub/215/pg215.txt" },
  @{ id="white-fang";                  url="https://www.gutenberg.org/cache/epub/910/pg910.txt" },
  @{ id="the-sea-wolf";                url="https://www.gutenberg.org/cache/epub/1074/pg1074.txt" },
  @{ id="around-world-80-days";        url="https://www.gutenberg.org/cache/epub/103/pg103.txt" },
  @{ id="journey-to-center-of-earth";  url="https://www.gutenberg.org/cache/epub/18857/pg18857.txt" },
  @{ id="the-mysterious-island";       url="https://www.gutenberg.org/cache/epub/3091/pg3091.txt" },
  @{ id="count-of-monte-cristo";       url="https://www.gutenberg.org/cache/epub/1184/pg1184.txt" },
  @{ id="three-musketeers";            url="https://www.gutenberg.org/cache/epub/1257/pg1257.txt" },
  @{ id="robinson-crusoe";             url="https://www.gutenberg.org/cache/epub/521/pg521.txt" },
  @{ id="gullivers-travels";           url="https://www.gutenberg.org/cache/epub/829/pg829.txt" },
  @{ id="the-odyssey";                 url="https://www.gutenberg.org/cache/epub/1727/pg1727.txt" },
  @{ id="the-iliad";                   url="https://www.gutenberg.org/cache/epub/6130/pg6130.txt" },
  @{ id="the-prisoner-of-zenda";       url="https://www.gutenberg.org/cache/epub/95/pg95.txt" },
  @{ id="the-scarlet-pimpernel";       url="https://www.gutenberg.org/cache/epub/60/pg60.txt" },
  @{ id="king-solomons-mines";         url="https://www.gutenberg.org/cache/epub/2166/pg2166.txt" },
  @{ id="she";                         url="https://www.gutenberg.org/cache/epub/3155/pg3155.txt" },
  @{ id="captain-blood";               url="https://www.gutenberg.org/cache/epub/1965/pg1965.txt" },
  @{ id="the-sea-hawk";                url="https://www.gutenberg.org/cache/epub/1964/pg1964.txt" },
  @{ id="tarzan-of-the-apes";          url="https://www.gutenberg.org/cache/epub/78/pg78.txt" },
  @{ id="the-return-of-tarzan";        url="https://www.gutenberg.org/cache/epub/81/pg81.txt" },
  @{ id="the-merry-adventures-of-robin-hood"; url="https://www.gutenberg.org/cache/epub/964/pg964.txt" },
  @{ id="the-swiss-family-robinson";   url="https://www.gutenberg.org/cache/epub/1844/pg1844.txt" },

  # --- MYSTERY ---
  @{ id="sherlock-holmes";             url="https://www.gutenberg.org/cache/epub/1661/pg1661.txt" },
  @{ id="sherlock-hound-baskervilles"; url="https://www.gutenberg.org/cache/epub/2852/pg2852.txt" },
  @{ id="a-study-in-scarlet";          url="https://www.gutenberg.org/cache/epub/244/pg244.txt" },
  @{ id="the-sign-of-the-four";        url="https://www.gutenberg.org/cache/epub/2097/pg2097.txt" },
  @{ id="the-memoirs-of-sherlock-holmes"; url="https://www.gutenberg.org/cache/epub/834/pg834.txt" },
  @{ id="the-return-of-sherlock-holmes"; url="https://www.gutenberg.org/cache/epub/1141/pg1141.txt" },
  @{ id="the-mysterious-affair-at-styles"; url="https://www.gutenberg.org/cache/epub/863/pg863.txt" },
  @{ id="the-secret-adversary";        url="https://www.gutenberg.org/cache/epub/1155/pg1155.txt" },
  @{ id="the-murder-on-the-links";     url="https://www.gutenberg.org/cache/epub/58866/pg58866.txt" },
  @{ id="the-man-in-the-brown-suit";   url="https://www.gutenberg.org/cache/epub/61168/pg61168.txt" },
  @{ id="the-phantom-of-the-opera";    url="https://www.gutenberg.org/cache/epub/175/pg175.txt" },
  @{ id="the-mystery-of-the-yellow-room"; url="https://www.gutenberg.org/cache/epub/10582/pg10582.txt" },
  @{ id="the-woman-in-white";          url="https://www.gutenberg.org/cache/epub/583/pg583.txt" },
  @{ id="the-moonstone";               url="https://www.gutenberg.org/cache/epub/155/pg155.txt" },
  @{ id="the-riddle-of-the-sands";     url="https://www.gutenberg.org/cache/epub/2360/pg2360.txt" },

  # --- SCI-FI & FANTASY ---
  @{ id="war-of-worlds";               url="https://www.gutenberg.org/cache/epub/36/pg36.txt" },
  @{ id="time-machine";                url="https://www.gutenberg.org/cache/epub/35/pg35.txt" },
  @{ id="invisible-man";               url="https://www.gutenberg.org/cache/epub/5230/pg5230.txt" },
  @{ id="the-island-of-doctor-moreau"; url="https://www.gutenberg.org/cache/epub/159/pg159.txt" },
  @{ id="the-first-men-in-the-moon";   url="https://www.gutenberg.org/cache/epub/1013/pg1013.txt" },
  @{ id="twenty-thousand-leagues";     url="https://www.gutenberg.org/cache/epub/164/pg164.txt" },
  @{ id="alice-in-wonderland";         url="https://www.gutenberg.org/cache/epub/11/pg11.txt" },
  @{ id="through-the-looking-glass";   url="https://www.gutenberg.org/cache/epub/12/pg12.txt" },
  @{ id="peter-pan";                   url="https://www.gutenberg.org/cache/epub/16/pg16.txt" },
  @{ id="the-wind-in-the-willows";     url="https://www.gutenberg.org/cache/epub/289/pg289.txt" },
  @{ id="the-wonderful-wizard-of-oz";  url="https://www.gutenberg.org/cache/epub/43936/pg43936.txt" },
  @{ id="the-marvelous-land-of-oz";    url="https://www.gutenberg.org/cache/epub/54/pg54.txt" },
  @{ id="ozma-of-oz";                  url="https://www.gutenberg.org/cache/epub/33361/pg33361.txt" },
  @{ id="a-princess-of-mars";          url="https://www.gutenberg.org/cache/epub/62/pg62.txt" },
  @{ id="the-gods-of-mars";            url="https://www.gutenberg.org/cache/epub/64/pg64.txt" },
  @{ id="the-warlord-of-mars";          url="https://www.gutenberg.org/cache/epub/68/pg68.txt" },
  @{ id="flatland";                    url="https://www.gutenberg.org/cache/epub/201/pg201.txt" },
  @{ id="phantastes";                  url="https://www.gutenberg.org/cache/epub/325/pg325.txt" },
  @{ id="the-princess-and-the-goblin"; url="https://www.gutenberg.org/cache/epub/726/pg726.txt" },

  # --- SELF-HELP & BUSINESS ---
  @{ id="psychology-of-management";    url="https://www.gutenberg.org/cache/epub/16256/pg16256.txt" },
  @{ id="think-and-grow-rich";         url="https://www.gutenberg.org/cache/epub/67138/pg67138.txt" },
  @{ id="personal-efficiency";         url="https://www.gutenberg.org/cache/epub/36622/pg36622.txt" },
  @{ id="art-of-money-getting";        url="https://www.gutenberg.org/cache/epub/8581/pg8581.txt" },
  @{ id="live-on-24-hours-a-day";      url="https://www.gutenberg.org/cache/epub/2274/pg2274.txt" },
  @{ id="self-development";            url="https://www.gutenberg.org/cache/epub/36940/pg36940.txt" },
  @{ id="the-art-of-war";              url="https://www.gutenberg.org/cache/epub/132/pg132.txt" },
  @{ id="the-prince";                  url="https://www.gutenberg.org/cache/epub/1232/pg1232.txt" },
  @{ id="as-a-man-thinketh";           url="https://www.gutenberg.org/cache/epub/4507/pg4507.txt" },
  @{ id="the-path-of-prosperity";      url="https://www.gutenberg.org/cache/epub/5459/pg5459.txt" },
  @{ id="out-from-the-heart";          url="https://www.gutenberg.org/cache/epub/7705/pg7705.txt" },
  @{ id="self-reliance";               url="https://www.gutenberg.org/cache/epub/38781/pg38781.txt" },
  @{ id="essays-by-emerson";           url="https://www.gutenberg.org/cache/epub/2944/pg2944.txt" },
  @{ id="character";                   url="https://www.gutenberg.org/cache/epub/13735/pg13735.txt" },
  @{ id="thrift";                      url="https://www.gutenberg.org/cache/epub/14418/pg14418.txt" },
  @{ id="duty";                        url="https://www.gutenberg.org/cache/epub/15206/pg15206.txt" },

  # --- PSYCHOLOGY & PHILOSOPHY ---
  @{ id="dream-psychology";            url="https://www.gutenberg.org/cache/epub/15489/pg15489.txt" },
  @{ id="the-interpretation-of-dreams"; url="https://www.gutenberg.org/cache/epub/66084/pg66084.txt" },
  @{ id="psychopathology-of-everyday-life"; url="https://www.gutenberg.org/cache/epub/63391/pg63391.txt" },
  @{ id="introductory-lectures-on-psychoanalysis"; url="https://www.gutenberg.org/cache/epub/67123/pg67123.txt" },
  @{ id="group-psychology-and-analysis-of-the-ego"; url="https://www.gutenberg.org/cache/epub/35877/pg35877.txt" },
  @{ id="meditations";                 url="https://www.gutenberg.org/cache/epub/64481/pg64481.txt" },
  @{ id="walden";                      url="https://www.gutenberg.org/cache/epub/205/pg205.txt" },
  @{ id="on-liberty";                  url="https://www.gutenberg.org/cache/epub/34901/pg34901.txt" },
  @{ id="the-prophet";                 url="https://www.gutenberg.org/cache/epub/58585/pg58585.txt" },
  @{ id="the-book-of-tea";             url="https://www.gutenberg.org/cache/epub/769/pg769.txt" },
  @{ id="the-varieties-of-religious-experience"; url="https://www.gutenberg.org/cache/epub/621/pg621.txt" },
  @{ id="pragmatism";                  url="https://www.gutenberg.org/cache/epub/5116/pg5116.txt" },
  @{ id="beyond-good-and-evil";        url="https://www.gutenberg.org/cache/epub/4363/pg4363.txt" },
  @{ id="thus-spake-zarathustra";      url="https://www.gutenberg.org/cache/epub/1998/pg1998.txt" },
  @{ id="the-antichrist";              url="https://www.gutenberg.org/cache/epub/19322/pg19322.txt" },
  @{ id="the-republic";                url="https://www.gutenberg.org/cache/epub/1497/pg1497.txt" },
  @{ id="the-symposium";               url="https://www.gutenberg.org/cache/epub/1600/pg1600.txt" },

  # --- CLASSIC LITERATURE ---
  @{ id="frankenstein";                url="https://www.gutenberg.org/cache/epub/84/pg84.txt" },
  @{ id="dracula";                     url="https://www.gutenberg.org/cache/epub/345/pg345.txt" },
  @{ id="great-gatsby";                url="https://www.gutenberg.org/cache/epub/64317/pg64317.txt" },
  @{ id="this-side-of-paradise";       url="https://www.gutenberg.org/cache/epub/805/pg805.txt" },
  @{ id="the-metamorphosis";           url="https://www.gutenberg.org/cache/epub/5200/pg5200.txt" },
  @{ id="tale-of-two-cities";          url="https://www.gutenberg.org/cache/epub/98/pg98.txt" },
  @{ id="oliver-twist";                url="https://www.gutenberg.org/cache/epub/730/pg730.txt" },
  @{ id="a-christmas-carol";           url="https://www.gutenberg.org/cache/epub/46/pg46.txt" },
  @{ id="great-expectations";          url="https://www.gutenberg.org/cache/epub/1400/pg1400.txt" },
  @{ id="david-copperfield";           url="https://www.gutenberg.org/cache/epub/766/pg766.txt" },
  @{ id="bleak-house";                 url="https://www.gutenberg.org/cache/epub/1023/pg1023.txt" },
  @{ id="hard-times";                  url="https://www.gutenberg.org/cache/epub/194/pg194.txt" },
  @{ id="hamlet";                      url="https://www.gutenberg.org/cache/epub/1524/pg1524.txt" },
  @{ id="the-picture-of-dorian-gray";  url="https://www.gutenberg.org/cache/epub/174/pg174.txt" },
  @{ id="the-importance-of-being-earnest"; url="https://www.gutenberg.org/cache/epub/844/pg844.txt" },
  @{ id="crime-and-punishment";        url="https://www.gutenberg.org/cache/epub/2554/pg2554.txt" },
  @{ id="brothers-karamazov";          url="https://www.gutenberg.org/cache/epub/28054/pg28054.txt" },
  @{ id="the-idiot";                   url="https://www.gutenberg.org/cache/epub/2638/pg2638.txt" },
  @{ id="the-gambler";                 url="https://www.gutenberg.org/cache/epub/2197/pg2197.txt" },
  @{ id="don-quixote";                 url="https://www.gutenberg.org/cache/epub/996/pg996.txt" },
  @{ id="the-strange-case-of-dr-jekyll-and-mr-hyde"; url="https://www.gutenberg.org/cache/epub/43/pg43.txt" },
  @{ id="les-miserables";              url="https://www.gutenberg.org/cache/epub/135/pg135.txt" },
  @{ id="the-hunchback-of-notre-dame"; url="https://www.gutenberg.org/cache/epub/2610/pg2610.txt" },
  @{ id="the-red-badge-of-courage";    url="https://www.gutenberg.org/cache/epub/73/pg73.txt" },
  @{ id="house-of-the-seven-gables";   url="https://www.gutenberg.org/cache/epub/1826/pg1826.txt" },
  @{ id="the-scarlet-letter";          url="https://www.gutenberg.org/cache/epub/33/pg33.txt" },
  @{ id="pygmalion";                   url="https://www.gutenberg.org/cache/epub/3825/pg3825.txt" },
  @{ id="faust";                       url="https://www.gutenberg.org/cache/epub/14591/pg14591.txt" },
  @{ id="the-divine-comedy";           url="https://www.gutenberg.org/cache/epub/8800/pg8800.txt" },
  @{ id="uncle-toms-cabin";            url="https://www.gutenberg.org/cache/epub/203/pg203.txt" },
  @{ id="the-awakening";               url="https://www.gutenberg.org/cache/epub/160/pg160.txt" },
  @{ id="main-street";                 url="https://www.gutenberg.org/cache/epub/2442/pg2442.txt" },
  @{ id="babbitt";                     url="https://www.gutenberg.org/cache/epub/1158/pg1158.txt" },
  @{ id="the-jungle";                  url="https://www.gutenberg.org/cache/epub/140/pg140.txt" }
)

$outDir = "public\books"
$total  = $books.Count
$i      = 0

foreach ($book in $books) {
  $i++
  $dest = "$outDir\$($book.id).txt"
  if (Test-Path $dest) {
    Write-Host "[$i/$total] Already exists: $($book.id)" -ForegroundColor Gray
    continue
  }
  Write-Host "[$i/$total] Downloading $($book.id)..." -ForegroundColor Cyan
  try {
    Invoke-WebRequest -Uri $book.url -OutFile $dest -UseBasicParsing -TimeoutSec 30
    $size = (Get-Item $dest).Length
    $kb = [math]::Round($size / 1024)
    Write-Host "  OK - Saved ($kb KB)" -ForegroundColor Green
  } catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
  }
  Start-Sleep -Milliseconds 300
}

Write-Host "Done. Check public\books\ for downloaded files." -ForegroundColor Green
