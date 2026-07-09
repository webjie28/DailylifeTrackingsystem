$books = @(
  @{ id="frankenstein";                url="https://www.gutenberg.org/cache/epub/84/pg84.txt" },
  @{ id="sherlock-holmes";             url="https://www.gutenberg.org/cache/epub/1661/pg1661.txt" },
  @{ id="pride-and-prejudice";         url="https://www.gutenberg.org/cache/epub/1342/pg1342.txt" },
  @{ id="moby-dick";                   url="https://www.gutenberg.org/cache/epub/2701/pg2701.txt" },
  @{ id="dracula";                     url="https://www.gutenberg.org/cache/epub/345/pg345.txt" },
  @{ id="great-gatsby";                url="https://www.gutenberg.org/cache/epub/64317/pg64317.txt" },
  @{ id="adventures-huckleberry-finn"; url="https://www.gutenberg.org/cache/epub/76/pg76.txt" },
  @{ id="alice-in-wonderland";         url="https://www.gutenberg.org/cache/epub/11/pg11.txt" },
  @{ id="sherlock-hound-baskervilles"; url="https://www.gutenberg.org/cache/epub/2852/pg2852.txt" },
  @{ id="the-metamorphosis";           url="https://www.gutenberg.org/cache/epub/5200/pg5200.txt" },
  @{ id="war-of-worlds";               url="https://www.gutenberg.org/cache/epub/36/pg36.txt" },
  @{ id="time-machine";                url="https://www.gutenberg.org/cache/epub/35/pg35.txt" },
  @{ id="tale-of-two-cities";          url="https://www.gutenberg.org/cache/epub/98/pg98.txt" },
  @{ id="oliver-twist";                url="https://www.gutenberg.org/cache/epub/730/pg730.txt" },
  @{ id="count-of-monte-cristo";       url="https://www.gutenberg.org/cache/epub/1184/pg1184.txt" },
  @{ id="three-musketeers";            url="https://www.gutenberg.org/cache/epub/1257/pg1257.txt" },
  @{ id="romeo-and-juliet";            url="https://www.gutenberg.org/cache/epub/1112/pg1112.txt" },
  @{ id="hamlet";                      url="https://www.gutenberg.org/cache/epub/1524/pg1524.txt" },
  @{ id="the-picture-of-dorian-gray";  url="https://www.gutenberg.org/cache/epub/174/pg174.txt" },
  @{ id="crime-and-punishment";        url="https://www.gutenberg.org/cache/epub/2554/pg2554.txt" },
  @{ id="invisible-man";               url="https://www.gutenberg.org/cache/epub/5230/pg5230.txt" },
  @{ id="treasure-island";             url="https://www.gutenberg.org/cache/epub/120/pg120.txt" },
  @{ id="call-of-wild";                url="https://www.gutenberg.org/cache/epub/215/pg215.txt" },
  @{ id="peter-pan";                   url="https://www.gutenberg.org/cache/epub/16/pg16.txt" },
  @{ id="around-world-80-days";        url="https://www.gutenberg.org/cache/epub/103/pg103.txt" },
  @{ id="twenty-thousand-leagues";     url="https://www.gutenberg.org/cache/epub/164/pg164.txt" },
  @{ id="don-quixote";                 url="https://www.gutenberg.org/cache/epub/996/pg996.txt" },
  @{ id="anna-karenina";               url="https://www.gutenberg.org/cache/epub/1399/pg1399.txt" },
  @{ id="brothers-karamazov";          url="https://www.gutenberg.org/cache/epub/28054/pg28054.txt" },
  @{ id="sense-and-sensibility";       url="https://www.gutenberg.org/cache/epub/161/pg161.txt" },
  @{ id="psychology-of-management";    url="https://www.gutenberg.org/cache/epub/16256/pg16256.txt" },
  @{ id="think-and-grow-rich";         url="https://www.gutenberg.org/cache/epub/67138/pg67138.txt" },
  @{ id="personal-efficiency";         url="https://www.gutenberg.org/cache/epub/36622/pg36622.txt" },
  @{ id="dream-psychology";            url="https://www.gutenberg.org/cache/epub/15489/pg15489.txt" },
  @{ id="art-of-money-getting";        url="https://www.gutenberg.org/cache/epub/8581/pg8581.txt" },
  @{ id="live-on-24-hours-a-day";      url="https://www.gutenberg.org/cache/epub/2274/pg2274.txt" },
  @{ id="self-development";            url="https://www.gutenberg.org/cache/epub/36940/pg36940.txt" }
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
